import { NextRequest, NextResponse } from "next/server";
import { whatsappController } from "../../../modules/whatsapp/whatsapp.controller";

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
    console.error("GET WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Process payload asynchronously (webhook handler fires without blocking 200 OK)
    await whatsappController.handleWebhookPayload(body);

    // Always return 200 OK to Meta to avoid retry storms
    return new NextResponse("success", { status: 200 });
  } catch (error) {
    console.error("POST WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
