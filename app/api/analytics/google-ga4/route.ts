import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { protos } from '@google-analytics/data';

const propertyId = process.env.GA_PROPERTY_ID;

const analyticsClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export async function GET() {
  try {
    // Admin pages ko exclude karne ka filter logic
    const excludeAdminFilter: protos.google.analytics.data.v1beta.IFilterExpression = {
      notExpression: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'BEGINS_WITH' as const,
            value: '/admin',
          },
        },
      },
    };

    // Parallel requests for all data points
    const [
      overviewRes, 
      trafficRes, 
      behaviorRes, 
      geoRes, 
      eventRes, 
      deviceRes, 
      referralRes // ✅ Naya referral response add kiya
    ] = await Promise.all([
      // 1. Overview Data
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
      }),

      // 2. Traffic Sources (Channels)
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'activeUsers' }],
      }),

      // 3. User Behavior (Top Pages - Filtered)
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        dimensionFilter: excludeAdminFilter,
      }),

      // 4. Geo Data (Cities)
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'city' }],
        metrics: [{ name: 'activeUsers' }],
      }),

      // 5. Events Report (Filtered)
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'eventName' }, { name: 'pagePath' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: excludeAdminFilter,
      }),

      // 6. Device Breakdown
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
      }),

      // 7. Referral Sources (LinkedIn, Insta, FB, etc.) 🔗
      analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pageReferrer' }],
        metrics: [{ name: 'activeUsers' }],
        dimensionFilter: excludeAdminFilter,
      }),
    ]);

    // Sabhi responses ko pack karna
    const allData = {
      overview: overviewRes[0].rows || [],
      traffic: trafficRes[0].rows || [],
      behavior: behaviorRes[0].rows || [],
      geo: geoRes[0].rows || [],
      events: eventRes[0].rows || [],
      devices: deviceRes[0].rows || [],
      referrers: referralRes[0].rows || [], // ✅ Frontend ke liye data ready
    };

    return Response.json(allData);

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}