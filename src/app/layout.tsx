import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PROJECTS } from "@/app/data/projects";
import { SITE } from "@/app/data/site";
import { capitalize, numberWord } from "@/lib/text";

// The one typeface. The opsz axis is loaded so the browser picks the optical
// size from the font size (font-optical-sizing: auto): the text cut for body
// copy, the sharper display cut for headings. Code uses the system monospace.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const siteUrl = "https://ashwinsathian.com";
// Meta description: under 160 chars, facts already on the site.
const siteDescription =
  "Ashwin Sathian, senior full-stack engineer in Kochi. Five years as founding engineer at Penny Software, a procurement platform that grew to $1B+ GTV.";
// Longer form for the Person and WebSite schema.
const personDescription = `Senior full-stack engineer with eight years of experience. Founding engineer at Penny Software for five of them, taking it from zero to a procurement platform that grew to $1B+ in GTV. ${capitalize(numberWord(PROJECTS.length))} independent products shipped on his own time.`;

export const viewport: Viewport = {
  themeColor: "#050505",
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
    icon: "/favicon.svg?v=8",
    shortcut: "/favicon.svg?v=8",
    apple: "/apple-touch-icon.png?v=8",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Ashwin Sathian",
  url: siteUrl,
  email: "mailto:ashwinsathyan19@gmail.com",
  description: personDescription,
  image: `${siteUrl}/og`,
  sameAs: [SITE.linkedin, SITE.github, "https://dev.to/ashwinsathian"],
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
    <html lang="en" className={bricolage.variable}>
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
