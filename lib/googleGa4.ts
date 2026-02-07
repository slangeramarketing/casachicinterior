// @/lib/googleGa4.ts

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { protos } from "@google-analytics/data";

const propertyId = process.env.GA_PROPERTY_ID;

const analyticsClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export async function fetchGa4DashboardData() {
  const excludeAdminFilter: protos.google.analytics.data.v1beta.IFilterExpression = {
    notExpression: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "BEGINS_WITH",
          value: "/admin",
        },
      },
    },
  };

  const [
    overviewRes,
    trafficRes,
    behaviorRes,
    geoRes,
    eventRes,
    deviceRes,
    referralRes,
  ] = await Promise.all([
    analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
    }),
    analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "activeUsers" }],
    }),
    analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: excludeAdminFilter,
    }),
    analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "city" }],
      metrics: [{ name: "activeUsers" }],
    }),
    analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "eventName" }, { name: "pagePath" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: excludeAdminFilter,
    }),
    analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
    }),
    analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [
        { name: "sessionSource" },
        { name: "sessionMedium" }
      ],
      metrics: [{ name: "activeUsers" }],
    }),

  ]);

  return {
    overview: overviewRes[0].rows ?? [],
    traffic: trafficRes[0].rows ?? [],
    behavior: behaviorRes[0].rows ?? [],
    geo: geoRes[0].rows ?? [],
    events: eventRes[0].rows ?? [],
    devices: deviceRes[0].rows ?? [],
    referrers: referralRes[0].rows ?? [],
  };
}
