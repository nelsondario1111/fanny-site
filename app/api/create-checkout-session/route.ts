import { NextRequest, NextResponse } from "next/server";

/**
 * Temporary stub — Stripe disabled.
 * This keeps the endpoint alive for future use,
 * but won't break the build when no STRIPE_SECRET_KEY is present.
 */

export async function POST(req: NextRequest) {
  console.log("API route HIT! (Stripe temporarily disabled)");

  try {
    const { priceId } = await req.json();
    console.log("Received priceId:", priceId);

    if (!priceId) {
      console.log("No priceId provided!");
      return NextResponse.json({ error: "Missing priceId." }, { status: 400 });
    }

    // Skip Stripe logic for now — just return a dummy success URL
    const fakeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id=fake_session`;
    console.log("Returning fake success URL:", fakeUrl);

    return NextResponse.json({ url: fakeUrl });
  } catch (error) {
    console.error("Stub error:", error);
    return NextResponse.json(
      { error: "Checkout temporarily disabled." },
      { status: 500 }
    );
  }
}
