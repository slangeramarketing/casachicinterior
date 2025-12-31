import { NextResponse } from "next/server";
import { mockPerformance } from "@/lib/analytics/mock";

export async function GET() {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json(mockPerformance);
  }

  // Production me PageSpeed API call hoga
  return NextResponse.json({ message: "Prod mode" });
}
