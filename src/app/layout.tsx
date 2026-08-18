import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Source_Serif_4, Archivo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import MotionProvider from "@/components/MotionProvider";

const displayMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

const bodySerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const uiSans = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://ashwinsathian.com";
const siteDescription =
  "Full-stack engineer and engineering leader. Seven years building SaaS platforms at scale, $1B+ GTV, with an AI-augmented engineering practice.";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ashwin Sathian | Lead Engineer, AI-Augmented Full-Stack SaaS",
    template: "%s | Ashwin Sathian",
  },
  description: siteDescription,
  keywords: [
    "Ashwin Sathian",
    "Lead Engineer",
    "Full-Stack Engineer",
    "AI-augmented engineering",
    "SaaS platform engineer",
    "Angular expert",
    "NestJS",
    "Next.js",
    "TypeScript engineer",
    "HighLevel engineer",
    "engineering leadership",
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
    title: "Ashwin Sathian | Lead Engineer, AI-Augmented Full-Stack SaaS",
    description: siteDescription,
    url: siteUrl,
    siteName: "Ashwin Sathian",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Ashwin Sathian, Lead Engineer, AI-Augmented Full-Stack SaaS",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Sathian | Lead Engineer, AI-Augmented Full-Stack SaaS",
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
  jobTitle: "Lead Engineer",
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "National Institute of Technology Calicut",
  },
  knowsAbout: [
    "AI-augmented software engineering",
    "SaaS platform architecture",
    "Multi-tenant platforms",
    "Engineering leadership",
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
    "LLM APIs",
    "AI-augmented development workflows",
    "Full-stack development",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Lead Software Engineer",
    occupationLocation: {
      "@type": "City",
      name: "Kochi, Kerala, India",
    },
    skills:
      "Angular, React, Next.js, NestJS, MongoDB, TypeScript, AWS, GCP, AI-augmented engineering",
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
    <html
      lang="en"
      className={`${displayMono.variable} ${bodySerif.variable} ${uiSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <noscript>
          <style>{`.motion-safe-reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className="min-h-screen bg-canvas text-ink-1"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        <MotionProvider>
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
