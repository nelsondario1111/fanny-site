import { NextResponse, NextRequest } from "next/server";

/** Default MailerLite Group ID (used if none provided) */
const DEFAULT_GROUP_ID = "157670436745774731";

/** Expected shape of MailerLite error responses */
interface MailerLiteErrorResponse {
  error?: string | { message?: string };
  message?: string;
}

/**
 * POST /api/subscribe
 * Handles newsletter subscriptions through MailerLite
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name, groupId } = (await request.json()) as {
      email?: string;
      name?: string;
      groupId?: string;
    };

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
          "X-MailerLite-ApiKey": process.env.MAILERLITE_API_TOKEN ?? "",
        },
        body: JSON.stringify(payload),
      }
    );

    // --- Handle success ---
    if (res.ok) {
      return NextResponse.json({ success: true });
    }

    // --- Handle MailerLite API errors safely ---
    let message = "MailerLite error.";
    try {
      const data = (await res.json()) as MailerLiteErrorResponse;
      if (typeof data === "object" && data !== null) {
        if (typeof data.error === "string") {
          message = data.error;
        } else if (data.error && typeof data.error === "object" && data.error.message) {
          message = data.error.message;
        } else if (data.message) {
          message = data.message;
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
