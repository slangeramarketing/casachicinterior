import { NextRequest, NextResponse } from "next/server";
import { whatsappController } from "../../../modules/whatsapp/whatsapp.controller";
import connectDB from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const verifiedChallenge = whatsappController.verifyWebhook(mode, token, challenge);

    if (verifiedChallenge) {
      // Must return plain challenge as text per Meta requirements
      return new NextResponse(verifiedChallenge, { status: 200 });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch (error) {
    console.error("[WhatsApp] GET Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Establish DB Connection immediately
    await connectDB();

    const body = await req.json();
    
    // 2. Log entry (only for WhatsApp messages)
    if (body.object === "whatsapp_business_account") {
       console.log(`[WhatsApp] Incoming Webhook Payload Received`);
    }

    // Process payload asynchronously (webhook handler fires without blocking 200 OK)
    await whatsappController.handleWebhookPayload(body);

    // Always return 200 OK to Meta to avoid retry storms
    return new NextResponse("success", { status: 200 });
  } catch (error) {
    console.error("[WhatsApp] POST Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
