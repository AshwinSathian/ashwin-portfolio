import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const CANVAS = "#000000";
const LABEL_1 = "#F5F5F7";
const LABEL_3 = "#6E6E73";
const LABEL_4 = "#48484A";
const ACCENT = "#2997FF";

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title");
  const description = searchParams.get("description");

  // Post card — when a title is supplied
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
            fontFamily: "Inter, -apple-system, sans-serif",
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
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: LABEL_4,
              }}
            >
              Writing
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
                fontWeight: 200,
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
                  fontWeight: 300,
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
      { width: 1200, height: 630 }
    );
  }

  // Site card — default, no params
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
          fontFamily: "Inter, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
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
            fontWeight: 100,
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
            fontWeight: 300,
            color: LABEL_3,
            letterSpacing: "-0.01em",
          }}
        >
          Seven years. $1B+ GTV. Calm architecture.
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
    { width: 1200, height: 630 }
  );
}
