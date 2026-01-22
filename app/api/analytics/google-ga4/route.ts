import { fetchGa4DashboardData } from "@/lib/googleGa4";


export async function GET() {
  try {
    const data = await fetchGa4DashboardData();
    return Response.json(data);
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Analytics error" },
      { status: 500 }
    );
  }
}
