import AnalyticsDashboard from "@/components/admin/clientComponent/dashboard/AnalyticsDashboard";
import { fetchGa4DashboardData } from "@/lib/googleGa4";

type Ga4DashboardData = Awaited<ReturnType<typeof fetchGa4DashboardData>>;

const EMPTY_DASHBOARD_DATA: Ga4DashboardData = {
  overview: [],
  traffic: [],
  behavior: [],
  geo: [],
  events: [],
  devices: [],
  referrers: [],
};

export default async function DashboardHomeServerPage() {
  let data: Ga4DashboardData = EMPTY_DASHBOARD_DATA;
  let analyticsUnavailable = false;

  // Google Analytics must never take the whole admin home page down.
  // A bad service-account key, a Google outage, or a missing env var
  // should degrade to an empty dashboard with a notice, not a 500.
  try {
    data = await fetchGa4DashboardData();
  } catch (err) {
    analyticsUnavailable = true;
    console.error(
      "[Admin Home] Google Analytics fetch failed:",
      err instanceof Error ? err.message : err
    );
  }

  return (
    <main>
      {analyticsUnavailable && (
        <div
          role="alert"
          className="mx-4 mt-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          Analytics data is unavailable right now. Check the Google Analytics
          service-account settings (GA_CLIENT_EMAIL, GA_PRIVATE_KEY, property ID)
          on the server, then reload this page.
        </div>
      )}
      <AnalyticsDashboard data={data} />
    </main>
  );
}
