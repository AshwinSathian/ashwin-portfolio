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
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#000000",
          color: "#F5F5F7",
          fontFamily: "Inter, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#6E6E73",
          }}
        >
          Engineering Leader
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 88,
            fontWeight: 200,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "#F5F5F7",
          }}
        >
          Engineering.
          <br />
          At scale.
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            fontWeight: 400,
            color: "#A1A1A6",
            letterSpacing: "-0.01em",
          }}
        >
          Ashwin Sathian · $1B+ GTV · 12 engineers · &lt;200ms
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
