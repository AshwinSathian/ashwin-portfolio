import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex", // multiple children -> must be flex
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          background: "#0b1020",
          padding: "64px",
          lineHeight: 1.2,
        }}
      >
        <div
          style={{
            display: "flex", // multiple children -> must be flex
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              marginBottom: 12,
              color: "white",
            }}
          >
            ASHWIN SATHIAN
          </div>
          <div
            style={{ fontSize: 28, color: "gray", textTransform: "uppercase" }}
          >
            Full-Stack Engineer • SaaS Architecture
          </div>
        </div>

        <div style={{ display: "flex" }}>
          <img
            src="https://ashwin-smoky.vercel.app/favicon.svg"
            alt=""
            width={120}
            height={120}
          />
        </div>
      </div>
    ),
    size
  );
}
