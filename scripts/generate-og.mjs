import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import React from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const size = { width: 1200, height: 630 };
const heroTitle = "Ashwin Sathian";
const heroMetrics = [
  { label: "GTV orchestrated", value: "$1B+" },
  { label: "Engineers led", value: "10+" },
  { label: "Critical latency", value: "<200 ms" },
];

const element = React.createElement(
  "div",
  {
    style: {
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
    },
  },
  React.createElement(
    "div",
    {
      style: {
        textTransform: "uppercase",
        letterSpacing: "0.5em",
        fontSize: 28,
        color: "#A78BFA",
      },
    },
    "Engineering Leader • SaaS Architecture",
  ),
  React.createElement(
    "div",
    {
      style: {
        marginTop: 28,
        fontSize: 96,
        fontWeight: 600,
        lineHeight: 1,
      },
    },
    heroTitle,
  ),
  React.createElement("div", {
    style: {
      marginTop: 18,
      width: "240px",
      height: "6px",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #8B5CF6, rgba(139,92,246,0))",
    },
  }),
  React.createElement(
    "div",
    {
      style: {
        marginTop: 32,
        fontSize: 36,
        color: "#B4BDD1",
        maxWidth: "820px",
        lineHeight: 1.3,
      },
    },
    "Building scalable, human-centered SaaS systems powering $1B+ GTV.",
  ),
  React.createElement(
    "div",
    {
      style: {
        marginTop: 48,
        display: "flex",
        gap: "22px",
        fontSize: 28,
        textTransform: "uppercase",
        letterSpacing: "0.32em",
        color: "#8C94AA",
      },
    },
    heroMetrics.map((metric) =>
      React.createElement(
        "span",
        { key: metric.label },
        `${metric.value} ${metric.label}`,
      ),
    ),
  ),
);

const response = new ImageResponse(element, size);
const buffer = Buffer.from(await response.arrayBuffer());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../public/og-2026.png");

await writeFile(outputPath, buffer);
console.log(`OG image generated at ${outputPath}`);
