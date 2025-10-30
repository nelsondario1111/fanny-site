import { NextResponse, NextRequest } from "next/server";

/**
 * Default MailerLite Group ID
 * (Used if no groupId is provided in the request)
 */
const DEFAULT_GROUP_ID = "157670436745774731";

/**
 * POST /api/subscribe
 * Handles newsletter subscriptions through MailerLite
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name, groupId } = await request.json();

    // --- Validate email ---
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const targetGroupId = groupId || DEFAULT_GROUP_ID;

    // --- Build payload ---
    const payload: { email: string; name?: string } = { email: cleanEmail };
    if (name && typeof name === "string" && name.trim()) {
      payload.name = name.trim();
    }

    // --- Send to MailerLite ---
    const res = await fetch(
      `https://api.mailerlite.com/api/v2/groups/${targetGroupId}/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-MailerLite-ApiKey": process.env.MAILERLITE_API_TOKEN!,
        },
        body: JSON.stringify(payload),
      }
    );

    // --- Handle success ---
    if (res.ok) {
      return NextResponse.json({ success: true });
    }

    // --- Handle MailerLite API errors ---
    let message = "MailerLite error.";
    try {
      const data: unknown = await res.json();
      if (data && typeof data === "object") {
        if ("error" in data && typeof (data as any).error === "string") {
          message = (data as any).error;
        } else if (
          "error" in data &&
          typeof (data as any).error === "object" &&
          (data as any).error?.message
        ) {
          message = (data as any).error.message;
        } else if ("message" in data && typeof (data as any).message === "string") {
          message = (data as any).message;
        }
      }
    } catch {
      // ignore parsing issues
    }

    return NextResponse.json({ success: false, error: message }, { status: 400 });

  } catch (err: unknown) {
    console.error("❌ /api/subscribe error:", err);

    const message =
      err instanceof Error ? err.message : "Unexpected server error.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
