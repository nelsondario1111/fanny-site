import { ImageResponse } from "next/og";

export type RenderOpts = {
  title?: string;
  subtitle?: string;
  locale?: "en" | "es";
  path?: string;
};

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const BRAND = {
  name: "Fanny — Holistic Financial Consultant",
  nameES: "Fanny — Consultora Financiera Holística",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    (process.env.NODE_ENV === "production"
      ? "https://www.fannysamaniego.com"
      : "http://localhost:3000"),
  green: "#1b6b5f",
  gold: "#d1a954",
  blue: "#184f7d",
  beige: "#fbf7f2",
};

// Format slugs into human-readable titles
function prettify(slugOrTitle?: string) {
  if (!slugOrTitle) return "";
  const raw = slugOrTitle.replace(/^\/+|\/+$/g, "");
  const last = raw.split("/").pop() || raw;
  return last
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

// Gradient + accent background
function Background() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${BRAND.beige} 0%, #ffffff 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 360,
          height: 360,
          borderRadius: 999,
          background: `${BRAND.gold}22`,
          filter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -160,
          left: -160,
          width: 420,
          height: 420,
          borderRadius: 999,
          background: `${BRAND.blue}18`,
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}

export async function renderOG({
  title,
  subtitle,
  locale = "en",
  path,
}: RenderOpts = {}) {
  const site = locale === "es" ? BRAND.nameES : BRAND.name;

  const finalTitle =
    title?.trim() ||
    (path ? prettify(path) : "") ||
    (locale === "es"
      ? "Artículos, Herramientas y Guías"
      : "Articles, Tools & Guides");

  const finalSubtitle =
    subtitle ??
    (locale === "es"
      ? "Impuestos • Hipotecas • Estrategia financiera"
      : "Taxes • Mortgages • Money Strategy");

  const sansFontFamily =
    '"DM Sans", ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  const displayFontFamily = 'Fraunces, Georgia, "Times New Roman", serif';

  return new ImageResponse(
    (
      <div
        style={{
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: sansFontFamily,
        }}
      >
        <Background />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "28px 36px",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 6,
              background: BRAND.green,
              border: `2px solid ${BRAND.gold}`,
              boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
            }}
          />
          <div
            style={{
              fontFamily: displayFontFamily,
              fontSize: 28,
              fontWeight: 650,
              color: BRAND.green,
              letterSpacing: -0.25,
            }}
          >
            {site}
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px 32px",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "6px 12px",
              borderRadius: 999,
              border: `2px solid ${BRAND.gold}`,
              color: BRAND.green,
              fontSize: 24,
              fontWeight: 700,
              background: "#fff",
            }}
          >
            {finalSubtitle}
          </div>

          <div
            style={{
              fontFamily: displayFontFamily,
              fontSize: 64,
              fontWeight: 650,
              color: BRAND.blue,
              lineHeight: 1.05,
              letterSpacing: -0.5,
              maxWidth: 980,
            }}
          >
            {finalTitle}
          </div>

          <div
            style={{
              height: 4,
              width: 180,
              background: BRAND.gold,
              marginTop: 10,
              borderRadius: 2,
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 36px",
            borderTop: `2px solid ${BRAND.gold}55`,
            color: BRAND.green,
            fontSize: 22,
            background: "#fff8",
            backdropFilter: "blur(4px)",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {locale === "es"
              ? "Asesoría clara para decisiones seguras."
              : "Clear advice for confident decisions."}
          </div>
          <div style={{ opacity: 0.85 }}>
            {BRAND.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
    }
  );
}
