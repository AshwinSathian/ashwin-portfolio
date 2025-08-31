import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "#0b1020",
          color: "white",
          padding: "64px",
          fontSize: 52,
          lineHeight: 1.2,
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <div style={{ fontSize: 28, opacity: 0.7, marginBottom: 12 }}>
            Ashwin Sathian
          </div>
          <div style={{ fontWeight: 700 }}>
            Full-Stack Engineer • SaaS Architecture
          </div>
        </div>
        <img
          src={`https://ashwin-smoky.vercel.app/favicon.svg`}
          alt=""
          width={96}
          height={96}
          style={{ opacity: 0.9 }}
        />
      </div>
    ),
    size
  );
}
