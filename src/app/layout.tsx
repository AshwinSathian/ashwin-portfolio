import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./globals.css";
import PrimeProvider from "@/components/providers/PrimeProvider";
import BreathingBackground from "@/components/BreathingBackground";
import ScrollProgress from "@/components/ScrollProgress";

const siteUrl = "https://ashwinsathian.com";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ashwin Sathian | Engineering Leader • SaaS Architecture",
  description:
    "Building scalable, human-centered SaaS systems powering $1B+ GTV. Calm leadership, fast systems.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Ashwin Sathian — Engineering Leader • SaaS Architecture",
    description: "Scalable SaaS with calm precision and measurable impact.",
    url: siteUrl,
    siteName: "Ashwin Sathian Portfolio",
    images: [
      {
        url: "/og-2026.png",
        width: 1200,
        height: 630,
        alt: "Ashwin Sathian Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Sathian — Engineering Leader • SaaS Architecture",
    description: "Scalable SaaS with calm precision and measurable impact.",
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
  worksFor: {
    "@type": "Organization",
    name: "Penny Software",
  },
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
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="relative min-h-screen overflow-x-hidden bg-bg text-text-primary">
        <PrimeProvider>
          <BreathingBackground />
          <ScrollProgress />
          <main className="relative z-10">{children}</main>
        </PrimeProvider>
      </body>
    </html>
  );
}
