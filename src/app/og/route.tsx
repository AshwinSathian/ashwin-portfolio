import { ImageResponse } from "next/og";
import { HERO } from "@/app/data/hero";

export const runtime = "edge";

export const contentType = "image/png";

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
          backgroundColor: "#0B1020",
          backgroundImage:
            "radial-gradient(1200px 600px at 20% 10%, rgba(139,92,246,0.38), transparent), radial-gradient(1000px 600px at 80% 0%, rgba(59,130,246,0.25), transparent)",
          color: "#E9ECF2",
          fontFamily: "Space Grotesk, Inter, sans-serif",
        }}
      >
        <div
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.5em",
            fontSize: 28,
            color: "#A78BFA",
          }}
        >
          Engineering Leader • SaaS Architecture
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 96,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {HERO.title}
        </div>
        <div
          style={{
            marginTop: 18,
            width: "240px",
            height: "6px",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #8B5CF6, rgba(139,92,246,0))",
          }}
        />
        <div
          style={{
            marginTop: 32,
            fontSize: 36,
            color: "#B4BDD1",
            maxWidth: "820px",
            lineHeight: 1.3,
          }}
        >
          Building scalable, human-centered SaaS systems powering $1B+ GTV.
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: "22px",
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: "0.32em",
            color: "#8C94AA",
          }}
        >
          {HERO.metrics.map((metric) => (
            <span key={metric.label}>
              {metric.value} {metric.label}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
