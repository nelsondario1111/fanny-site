import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  console.log("API route HIT!");

  try {
    const { priceId } = await req.json();
    console.log("Received priceId:", priceId);

    if (!priceId) {
      console.log("No priceId provided!");
      return NextResponse.json({ error: "Missing priceId." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });
    console.log("Session created! URL:", session.url);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Failed to create Stripe checkout session." }, { status: 500 });
  }
}
