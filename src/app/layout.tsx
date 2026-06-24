import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://ashwinsathian.com";
const siteDescription =
  "Full-stack engineer and engineering leader. Seven years building SaaS platforms at scale — $1B+ GTV, now leading engineering at HighLevel.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ashwin Sathian",
    template: "%s — Ashwin Sathian",
  },
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Ashwin Sathian",
    description: siteDescription,
    url: siteUrl,
    siteName: "Ashwin Sathian",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Ashwin Sathian — Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Sathian",
    description: siteDescription,
    creator: "@ashwinsathian",
    images: ["/og"],
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
  url: siteUrl,
  email: "mailto:ashwinsathyan19@gmail.com",
  description: siteDescription,
  sameAs: [
    "https://www.linkedin.com/in/ashwinsathian",
    "https://github.com/AshwinSathian",
  ],
  jobTitle: "Lead Engineer",
  worksFor: {
    "@type": "Organization",
    name: "HighLevel",
    url: "https://www.gohighlevel.com",
  },
  knowsAbout: [
    "SaaS architecture",
    "Multi-tenant platforms",
    "Angular",
    "React",
    "Next.js",
    "NestJS",
    "MongoDB",
    "TypeScript",
    "AWS",
    "GCP",
    "Engineering leadership",
    "Platform engineering",
    "CI/CD",
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
