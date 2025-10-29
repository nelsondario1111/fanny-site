import { NextResponse, NextRequest } from "next/server";

/**
 * Default MailerLite Group ID
 * (Used if no groupId is provided in the request)
 */
const DEFAULT_GROUP_ID = "157670436745774731";

export async function POST(request: NextRequest) {
  try {
    const { email, name, groupId } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Missing email address." },
        { status: 400 }
      );
    }

    // Use provided group ID or fallback to default
    const targetGroupId = groupId || DEFAULT_GROUP_ID;

    // Prepare payload
    const payload: { email: string; name?: string } = { email };
    if (name) payload.name = name;

    // Send request to MailerLite API
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

    if (res.ok) {
      return NextResponse.json({ success: true });
    }

    // --- Parse API error message safely ---
    let message = "MailerLite error.";
    try {
      const data: unknown = await res.json();
      if (data && typeof data === "object") {
        if (
          "error" in data &&
          typeof (data as { error?: { message?: string } }).error === "object" &&
          (data as { error?: { message?: string } }).error !== null &&
          "message" in (data as { error: { message?: string } }).error
        ) {
          const errObj = (data as { error: { message?: string } }).error;
          if (typeof errObj.message === "string") {
            message = errObj.message;
          }
        } else if (
          "error" in data &&
          typeof (data as { error?: string }).error === "string"
        ) {
          message = (data as { error: string }).error;
        } else if (
          "message" in data &&
          typeof (data as { message?: string }).message === "string"
        ) {
          message = (data as { message: string }).message;
        }
      }
    } catch {
      // ignore JSON parse error
    }

    return NextResponse.json({ success: false, error: message }, { status: 400 });

  } catch (err: unknown) {
    let message = "MailerLite error.";
    if (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message?: unknown }).message === "string"
    ) {
      message = (err as { message: string }).message;
    }
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
