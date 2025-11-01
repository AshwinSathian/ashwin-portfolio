import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import React from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const size = { width: 1200, height: 630 };
const siteName = "Ashwin Sathian";
const heroTagline = "Building calm, scalable SaaS with empathy and rigor.";

const element = React.createElement(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "72px 96px",
      backgroundImage:
        "radial-gradient(1200px 600px at 80% -100px, rgba(139,92,246,0.38), transparent), radial-gradient(800px 400px at -10% -50px, rgba(59,130,246,0.2), transparent)",
      backgroundColor: "#0B1020",
      color: "#E9ECF2",
      fontFamily: "Space Grotesk, Inter, sans-serif",
    },
  },
    React.createElement(
      "div",
      {
        style: {
          fontSize: 24,
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "#A78BFA",
        },
      },
      "Full-Stack Engineer · SaaS Architect",
    ),
    React.createElement(
      "div",
      {
        style: {
          marginTop: 24,
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          maxWidth: "920px",
        },
      },
      siteName,
    ),
    React.createElement("div", {
      style: {
        marginTop: 16,
        width: "220px",
        height: "6px",
        borderRadius: "999px",
        background: "linear-gradient(90deg, #8B5CF6, rgba(139,92,246,0))",
      },
    }),
  React.createElement(
    "div",
    {
      style: {
        marginTop: 28,
        fontSize: 34,
        color: "#B4BDD1",
        maxWidth: "820px",
        lineHeight: 1.3,
      },
    },
    heroTagline,
  ),
  React.createElement(
    "div",
    {
      style: {
        marginTop: 40,
        display: "flex",
        gap: "18px",
        fontSize: 24,
        color: "#8C94AA",
        textTransform: "uppercase",
        letterSpacing: "0.4em",
      },
    },
    React.createElement("span", null, "$1B+ GTV"),
    React.createElement("span", null, "Sub-200 ms latency"),
    React.createElement("span", null, "1.5× release cadence"),
  ),
);

const response = new ImageResponse(element, size);
const buffer = Buffer.from(await response.arrayBuffer());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../public/og.png");

await writeFile(outputPath, buffer);
console.log(`OG image generated at ${outputPath}`);
