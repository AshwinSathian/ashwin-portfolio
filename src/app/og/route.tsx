import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          backgroundColor: "#000000",
          color: "#F5F5F7",
          fontFamily: "Inter, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6E6E73",
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
            color: "#F5F5F7",
          }}
        >
          Ashwin Sathian.
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 18,
            fontWeight: 300,
            color: "#6E6E73",
            letterSpacing: "-0.01em",
          }}
        >
          ashwinsathian.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
