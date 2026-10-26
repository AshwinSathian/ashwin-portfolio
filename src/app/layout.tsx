import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// The one typeface. Optical size stays at the font default (14), the text cut,
// so the same file serves body copy and headings. Code uses the system monospace.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const siteUrl = "https://ashwinsathian.com";
const siteDescription =
  "Senior full-stack engineer with eight years of experience. Founding engineer at Penny Software for five of them, taking it from zero to a procurement platform that grew to $1B+ in GTV. Eight independent products shipped on his own time, each checked against the actual repo.";

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
  keywords: [
    "Ashwin Sathian",
    "Senior Full-Stack Engineer",
    "Founding Engineer",
    "Product Engineer",
    "SaaS platform engineer",
    "Angular expert",
    "NestJS",
    "Next.js",
    "TypeScript engineer",
    "HighLevel engineer",
    "multi-tenant SaaS",
    "Kochi",
    "India",
  ],
  authors: [{ name: "Ashwin Sathian", url: siteUrl }],
  creator: "Ashwin Sathian",
  alternates: {
    canonical: siteUrl,
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
    icon: "/favicon.svg?v=7",
    shortcut: "/favicon.svg?v=7",
    apple: "/apple-touch-icon.png?v=7",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Ashwin Sathian",
  url: siteUrl,
  email: "mailto:ashwinsathyan19@gmail.com",
  description: siteDescription,
  image: `${siteUrl}/og`,
  sameAs: [
    "https://www.linkedin.com/in/ashwinsathian",
    "https://github.com/AshwinSathian",
    "https://ashwinsathian.com",
  ],
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
  description: siteDescription,
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
