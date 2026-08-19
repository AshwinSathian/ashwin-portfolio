import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

// Dark-first, matching the site's default theme.
const CANVAS = "#14171A";
const LABEL_1 = "#EDEFF1";
const LABEL_3 = "#9AA3AC";
const LABEL_4 = "#5F6A73";
const ACCENT = "#E08F4E";

const MONO_FONT_FAMILY = "JetBrains Mono";

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

// Satori (the OG image renderer) has no access to system/CSS fonts — it only
// renders fonts explicitly handed to it as binary data. Without this, the
// `fontFamily` below was a no-op and every OG image silently fell back to
// Satori's default sans, contradicting the site's monospace identity.
async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,·—$%×↗ "
  )}`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`No font resource found for ${family} @${weight}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Failed to fetch font binary for ${family} @${weight}`);
  return res.arrayBuffer();
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const label = searchParams.get("label") ?? "Writing";

  const [regular, bold] = await Promise.all([
    loadGoogleFont(MONO_FONT_FAMILY, 400),
    loadGoogleFont(MONO_FONT_FAMILY, 700),
  ]);
  const fonts = [
    { name: MONO_FONT_FAMILY, data: regular, weight: 400 as const, style: "normal" as const },
    { name: MONO_FONT_FAMILY, data: bold, weight: 700 as const, style: "normal" as const },
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
            backgroundColor: CANVAS,
            fontFamily: MONO_FONT_FAMILY,
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
                backgroundColor: ACCENT,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: LABEL_4,
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
                fontSize: 54,
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: LABEL_1,
                maxWidth: 900,
              }}
            >
              {safeTitle}
            </div>
            {safeDesc && (
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: LABEL_3,
                  maxWidth: 760,
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
                fontSize: 15,
                fontWeight: 400,
                color: LABEL_3,
                letterSpacing: "-0.01em",
              }}
            >
              Ashwin Sathian
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: LABEL_4,
                letterSpacing: "0.02em",
              }}
            >
              ashwinsathian.com
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts }
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
          backgroundColor: CANVAS,
          fontFamily: MONO_FONT_FAMILY,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: LABEL_4,
            marginBottom: 28,
          }}
        >
          Engineer
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.045em",
            color: LABEL_1,
          }}
        >
          Ashwin Sathian.
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 17,
            fontWeight: 400,
            color: LABEL_3,
            letterSpacing: "-0.01em",
          }}
        >
          AI-augmented senior full-stack engineer. $1B+ GTV. Decisions published, not hidden.
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 14,
            fontWeight: 400,
            color: LABEL_4,
            letterSpacing: "0.02em",
          }}
        >
          ashwinsathian.com
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  );
}
