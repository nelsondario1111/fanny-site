// app/twitter-image.tsx
import { NextRequest } from "next/server";
import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "./_og/render";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;

export default async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname || "/";
  const locale = pathname.startsWith("/es") ? "es" : "en";

  // Keep it identical to OG for brand consistency
  const t = url.searchParams.get("t") || undefined;
  const st = url.searchParams.get("st") || undefined;

  return renderOG({
    title: t,
    subtitle: st,
    locale: locale as "en" | "es",
    path: pathname,
  });
}
