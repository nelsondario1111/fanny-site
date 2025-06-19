import { NextResponse, NextRequest } from "next/server";

// Use your actual MailerLite Group ID here
const GROUP_ID = "157670436745774731";

export async function POST(request: NextRequest) {
  const { email, name } = await request.json();

  if (!email) {
    return NextResponse.json({ success: false, error: "Missing email address." }, { status: 400 });
  }

  // Strictly typed payload
  const payload: { email: string; name?: string } = { email };
  if (name) payload.name = name;

  try {
    const res = await fetch(
      `https://api.mailerlite.com/api/v2/groups/${GROUP_ID}/subscribers`,
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
    } else {
      let message = "MailerLite error.";
      try {
        // Use unknown type, then type guards (no any)
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
    }
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
