import { NextResponse } from "next/server";
import { aiContentController } from "@/modules/ai-content/ai.controller";
// Ideally you would add admin auth checks here

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userPrompt, categories } = body;

    const response = await aiContentController.generateService({
      userPrompt,
      categories: categories || []
    });

    if (!response.success) {
      return NextResponse.json({ error: response.error }, { status: 400 });
    }

    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error("AI Generate Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
