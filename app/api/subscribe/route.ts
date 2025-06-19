import { NextResponse } from "next/server";

// Replace this with your actual MailerLite Group ID (find it in MailerLite under Audience > Groups)
const GROUP_ID = "157670436745774731"; // e.g. "123456789012345678"

export async function POST(request: Request) {
  const { email, name } = await request.json();

  if (!email) {
    return NextResponse.json({ success: false, error: "Missing email address." }, { status: 400 });
  }

  // Prepare the request body for MailerLite API
  const payload: Record<string, any> = { email };
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
        const data = await res.json();
        message = data.error?.message || data.message || data.error || message;
      } catch {}
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
  } catch (err) {
    let message = "MailerLite error.";
    if (err && typeof err === "object" && "message" in err) {
      message = (err as { message: string }).message || message;
    }
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
