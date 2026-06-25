import type { Metadata, Viewport } from "next";
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
  "Full-stack engineer and engineering leader. Seven years building SaaS platforms at scale — $1B+ GTV, AI-augmented workflows, now leading engineering at HighLevel.";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ashwin Sathian — Lead Engineer | AI-Augmented Full-Stack SaaS",
    template: "%s — Ashwin Sathian",
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
    title: "Ashwin Sathian — Lead Engineer | AI-Augmented Full-Stack SaaS",
    description: siteDescription,
    url: siteUrl,
    siteName: "Ashwin Sathian",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Ashwin Sathian — Lead Engineer, AI-Augmented Full-Stack SaaS",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Sathian — Lead Engineer | AI-Augmented Full-Stack SaaS",
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
  worksFor: {
    "@type": "Organization",
    name: "HighLevel",
    url: "https://www.gohighlevel.com",
    description:
      "All-in-one SaaS platform powering 60,000+ marketing agencies worldwide at $1.5B+ ARR",
  },
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Ashwin Sathian?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ashwin Sathian is a Lead Engineer based in Kochi, India. He currently leads engineering for HighLevel's Funnels, Websites, and Webinars products — three core revenue surfaces of a $1.5B+ ARR SaaS platform serving 60,000+ marketing agencies worldwide. Previously, he spent five years at Penny Software growing from Full Stack Developer to Lead Engineer, architecting a multi-tenant procurement platform handling $1B+ in GTV.",
      },
    },
    {
      "@type": "Question",
      name: "What is Ashwin Sathian's tech stack?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ashwin Sathian specialises in Angular, React, Next.js, NestJS, Node.js, MongoDB, TypeScript, AWS, and GCP. He uses AI-augmented workflows including Claude Code, GitHub Copilot, and LLM APIs as part of his engineering practice.",
      },
    },
    {
      "@type": "Question",
      name: "What companies has Ashwin Sathian worked at?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ashwin Sathian currently works at HighLevel as Lead Engineer for Funnels, Websites, and Webinars (March 2026–present). Previously he worked at Penny Software (5 years, 2020–2025), Manaraah, WeCP, Developly, and Reubro International.",
      },
    },
    {
      "@type": "Question",
      name: "What kind of engineering does Ashwin Sathian specialise in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ashwin Sathian specialises in full-stack SaaS platform engineering with a focus on AI-augmented development practices. He has deep expertise in multi-tenant architecture, RBAC, API performance optimisation, and engineering team leadership. He applies AI tooling — including LLM APIs and AI-assisted development workflows — to accelerate and elevate his engineering output.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I contact Ashwin Sathian?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ashwin Sathian can be contacted via email at ashwinsathyan19@gmail.com, on LinkedIn at linkedin.com/in/ashwinsathian, or on GitHub at github.com/AshwinSathian.",
      },
    },
  ],
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
