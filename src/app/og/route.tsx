import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

// Same tokens as globals.css; Satori cannot read CSS variables.
const NIGHT = "#15120f";
const FG = "#EFE8DA";
const FG_2 = "#BDB2A0";
const FG_3 = "#968B7A";

// Same faces as the site: Bricolage Grotesque for the title and name,
// Figtree for the rest.
const DISPLAY = "Bricolage Grotesque";
const BODY = "Figtree";

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

// Satori (the OG image renderer) has no access to system/CSS fonts — it only
// renders fonts explicitly handed to it as binary data. Without this, the
// `fontFamily` below was a no-op and every OG image silently fell back to
// Satori's default sans, ignoring the site's typefaces.
// Satori can't read woff2 or pick an instance from a variable font, so this
// asks Google Fonts for a static TTF per weight rather than reusing the
// site's self-hosted variable files. It runs on the server only; visitors'
// browsers never contact Google, and the CDN keeps the image for a year.
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

  const [body, bodyMedium, display] = await Promise.all([
    loadGoogleFont(BODY, 400),
    loadGoogleFont(BODY, 500),
    loadGoogleFont(DISPLAY, 700),
  ]);
  const fonts = [
    { name: BODY, data: body, weight: 400 as const, style: "normal" as const },
    { name: BODY, data: bodyMedium, weight: 500 as const, style: "normal" as const },
    { name: DISPLAY, data: display, weight: 700 as const, style: "normal" as const },
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
            fontFamily: BODY,
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
                fontFamily: DISPLAY,
                fontSize: safeTitle.length > 40 ? 64 : 96,
                fontWeight: 700,
                lineHeight: 1.02,
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
                fontFamily: DISPLAY,
                fontSize: 26,
                fontWeight: 700,
                color: FG,
                letterSpacing: "-0.02em",
              }}
            >
              Ashwin Sathian
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 500,
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
          fontFamily: BODY,
        }}
      >
        <div style={{ fontFamily: DISPLAY, fontSize: 132, fontWeight: 700, lineHeight: 0.98, letterSpacing: "-0.03em", color: FG }}>
          Ashwin Sathian
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
