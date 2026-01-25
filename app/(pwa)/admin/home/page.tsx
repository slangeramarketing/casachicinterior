import AnalyticsDashboard from "@/components/admin/clientComponent/dashboard/AnalyticsDashboard";
import { fetchGa4DashboardData } from "@/lib/googleGa4";

export default async function DashboardHomeServerPage() {
  const data = await fetchGa4DashboardData();

  return (
    <main>
      <AnalyticsDashboard data={data} />
    </main>
  );
}
