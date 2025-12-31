import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const metric = await req.json();

  // TODO: Save in DB later
  console.log("Web Vital:", metric);

  return NextResponse.json({ success: true });
}
