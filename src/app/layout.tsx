import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://ashwinsathian.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ashwin Sathian | Engineering Leader · SaaS Architecture",
  description:
    "Engineering at scale. $1B+ GTV. 12 engineers. Calm architecture, fast systems.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Ashwin Sathian — Engineering Leader · SaaS Architecture",
    description: "Engineering at scale. $1B+ GTV. Calm architecture, fast systems.",
    url: siteUrl,
    siteName: "Ashwin Sathian",
    images: [
      {
        url: "/og-2026.png",
        width: 1200,
        height: 630,
        alt: "Ashwin Sathian — Engineering Leader",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Sathian — Engineering Leader · SaaS Architecture",
    description: "Engineering at scale. $1B+ GTV. Calm architecture, fast systems.",
    images: ["/og-2026.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ashwin Sathian",
  jobTitle: "Engineering Leader",
  url: siteUrl,
  email: "mailto:ashwinsathyan19@gmail.com",
  sameAs: [
    "https://www.linkedin.com/in/ashwinsathian",
    "https://github.com/AshwinSathian",
  ],
  knowsAbout: [
    "SaaS architecture",
    "RBAC",
    "Multi-tenant platforms",
    "Angular",
    "Next.js",
    "NestJS",
    "MongoDB",
    "AWS",
    "GCP",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className="min-h-screen bg-canvas text-label-1"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <ScrollProgress />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
