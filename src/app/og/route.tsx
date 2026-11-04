import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

// Same tokens as globals.css; Satori cannot read CSS variables.
const NIGHT = "#050505";
const FG = "#F5F5F4";
const FG_2 = "#A6A6A6";
const FG_3 = "#8A8A8A";

const FONT_FAMILY = "Bricolage Grotesque";

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

// Satori (the OG image renderer) has no access to system/CSS fonts — it only
// renders fonts explicitly handed to it as binary data. Without this, the
// `fontFamily` below was a no-op and every OG image silently fell back to
// Satori's default sans, ignoring the site's typefaces.
async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:;·–$%×↗’'?!()/+& "
  )}`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`No font resource found for ${family} @${weight}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Failed to fetch font binary for ${family} @${weight}`);
  return res.arrayBuffer();
}

// Browsers keep a card for a day; the CDN keeps it for a year and revalidates in the background.
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const label = searchParams.get("label") ?? "Writing";

  const [regular, bold, heavy] = await Promise.all([
    loadGoogleFont(FONT_FAMILY, 400),
    loadGoogleFont(FONT_FAMILY, 700),
    loadGoogleFont(FONT_FAMILY, 800),
  ]);
  const fonts = [
    { name: FONT_FAMILY, data: regular, weight: 400 as const, style: "normal" as const },
    { name: FONT_FAMILY, data: bold, weight: 700 as const, style: "normal" as const },
    { name: FONT_FAMILY, data: heavy, weight: 800 as const, style: "normal" as const },
  ];

  // Post card, when a title is supplied
  if (title) {
    const safeTitle = truncate(title, 72);
    const safeDesc = description ? truncate(description, 130) : null;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            backgroundColor: NIGHT,
            fontFamily: FONT_FAMILY,
          }}
        >
          {/* Top: section label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 20,
                height: 2,
                backgroundColor: FG,
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: FG_3,
              }}
            >
              {label}
            </span>
          </div>

          {/* Middle: post title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              flex: 1,
              justifyContent: "center",
              paddingTop: 32,
              paddingBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: safeTitle.length > 40 ? 64 : 96,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: FG,
                maxWidth: 1000,
              }}
            >
              {safeTitle}
            </div>
            {safeDesc && (
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: FG_2,
                  maxWidth: 960,
                }}
              >
                {safeDesc}
              </div>
            )}
          </div>

          {/* Bottom: author + site */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: FG,
                letterSpacing: "-0.035em",
              }}
            >
              ashwin sathian.
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: FG_3,
                letterSpacing: "0.02em",
              }}
            >
              ashwinsathian.com
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts, headers: CACHE_HEADERS }
    );
  }

  // Site card, default, no params
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          backgroundColor: NIGHT,
          fontFamily: FONT_FAMILY,
        }}
      >
        <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.035em", color: FG }}>
          ashwin sathian.
        </div>
        <div style={{ marginTop: 40, fontSize: 34, fontWeight: 400, lineHeight: 1.3, color: FG_2, letterSpacing: "-0.01em", maxWidth: 900 }}>
          I turn a customer’s problem into a spec, then I ship it.
        </div>
        <div style={{ marginTop: 56, display: "flex", justifyContent: "space-between", fontSize: 20, color: FG_3 }}>
          <span>Senior full-stack engineer · Kochi, India</span>
          <span>ashwinsathian.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts, headers: CACHE_HEADERS }
  );
}
