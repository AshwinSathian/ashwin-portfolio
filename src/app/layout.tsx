import type { Metadata, Viewport } from "next";
import { Martian_Mono, Public_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Data/metadata only — dates, tags, code, fact labels. Not display type.
const dataMono = Martian_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Serves display, body, and UI chrome — one sans-serif family, deliberately
// not a serif/sans split. Public Sans is designed to hold up at both
// heading and body-copy sizes, unlike a display-only optical size.
const uiSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://ashwinsathian.com";
const siteDescription =
  "Senior full-stack engineer, 8+ years. Founding engineer at Penny Software for five of them, taking it from zero to a procurement platform that grew to $1B+ in GTV. Eight independent products shipped on his own time, each checked against the actual repo.";

export const viewport: Viewport = {
  themeColor: "#0A0B0D",
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
    <html
      lang="en"
      className={`${dataMono.variable} ${uiSans.variable}`}
      suppressHydrationWarning
    >
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
      <body
        className="min-h-screen bg-paper text-ink"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-100 -translate-y-16 rounded-full bg-accent px-4 py-2 font-ui text-[13px] font-medium text-paper transition-transform duration-150 focus-visible:translate-y-0 focus:outline-none"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
