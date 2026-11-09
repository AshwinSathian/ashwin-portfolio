import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PROJECTS } from "@/app/data/projects";
import { SITE } from "@/app/data/site";
import { capitalize, numberWord } from "@/lib/text";

// Self-hosted from the @fontsource-variable packages (OFL), so no request
// ever goes to Google Fonts. Latin subset only; the site is English.
// Bricolage Grotesque sets headings, Figtree everything else.

const bricolage = localFont({
  src: "../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  display: "swap",
});

const figtree = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2", weight: "300 900", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-italic.woff2", weight: "300 900", style: "italic" },
  ],
  variable: "--font-figtree",
  display: "swap",
});

// Code only, so it is not preloaded. Italic is for Shiki's comment style.
const jetbrainsMono = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", weight: "100 800", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-italic.woff2", weight: "100 800", style: "italic" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

const siteUrl = "https://ashwinsathian.com";
// Meta description: under 160 chars, facts already on the site.
const siteDescription =
  "Ashwin Sathian, senior full-stack engineer in Kochi. Five years as founding engineer at Penny Software, a procurement platform that grew to $1B+ GTV.";
// Longer form for the Person and WebSite schema.
const personDescription = `Senior full-stack engineer with eight years of experience. Founding engineer at Penny Software for five of them, taking it from zero to a procurement platform that grew to $1B+ in GTV. ${capitalize(numberWord(PROJECTS.length))} independent products shipped on his own time.`;

export const viewport: Viewport = {
  themeColor: "#15120f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ashwin Sathian | Senior Full-Stack Engineer",
    template: "%s | Ashwin Sathian",
  },
  description: siteDescription,
  authors: [{ name: "Ashwin Sathian", url: siteUrl }],
  creator: "Ashwin Sathian",
  alternates: {
    canonical: siteUrl,
    types: { "application/rss+xml": [{ url: "/writing/feed.xml", title: "Ashwin Sathian: Writing" }] },
  },
  openGraph: {
    title: "Ashwin Sathian | Senior Full-Stack Engineer",
    description: siteDescription,
    url: siteUrl,
    siteName: "Ashwin Sathian",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Ashwin Sathian, Senior Full-Stack Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Sathian | Senior Full-Stack Engineer",
    description: siteDescription,
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
    icon: "/favicon.svg?v=9",
    shortcut: "/favicon.svg?v=9",
    apple: "/apple-touch-icon.png?v=9",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Ashwin Sathian",
  url: siteUrl,
  email: "mailto:hello@ashwinsathian.com",
  description: personDescription,
  image: `${siteUrl}/og`,
  sameAs: [SITE.linkedin, SITE.github],
  jobTitle: "Senior Full-Stack Engineer",
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "National Institute of Technology Calicut",
  },
  knowsAbout: [
    "SaaS platform architecture",
    "Multi-tenant platforms",
    "System design",
    "Angular",
    "React",
    "Next.js",
    "NestJS",
    "Node.js",
    "MongoDB",
    "TypeScript",
    "AWS",
    "GCP",
    "Docker",
    "GitHub Actions",
    "Platform engineering",
    "CI/CD",
    "Full-stack development",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Senior Full-Stack Engineer",
    occupationLocation: {
      "@type": "City",
      name: "Kochi, Kerala, India",
    },
    skills: "Angular, React, Next.js, NestJS, MongoDB, TypeScript, AWS, GCP",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Ashwin Sathian",
  url: siteUrl,
  author: { "@id": `${siteUrl}/#person` },
  description: personDescription,
  inLanguage: "en-US",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-100 -translate-y-24 rounded-control bg-fg px-4 py-3 text-small font-medium text-night transition-transform duration-200 focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          <ViewTransition default="page">{children}</ViewTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
