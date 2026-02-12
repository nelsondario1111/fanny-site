// app/es/recursos/[article]/opengraph-image.tsx
import { NextRequest } from "next/server";
import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "@/app/_og/render";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;

export default async function GET(req: NextRequest, ctx: { params: { article: string } }) {
  const { article } = ctx.params;
  const url = new URL(req.url);

  const t = url.searchParams.get("t") || undefined;
  const st = url.searchParams.get("st") || "Impuestos • Hipotecas • Estrategia financiera";

  return renderOG({
    title: t ?? article,
    subtitle: st,
    locale: "es",
    path: `/es/recursos/${article}`,
  });
}
