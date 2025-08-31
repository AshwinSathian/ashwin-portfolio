import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://ashwin-smoky.vercel.app";
const title = "Ashwin Sathian";
const description =
  "Full Stack Developer • SaaS Specialist • Angular • Node.js • NestJS • MongoDB • Typescript";

export const metadata = {
  title: "Ashwin Sathian — Full-Stack Engineer (Angular • NestJS • Nx)",
  description:
    "Engineering leader with 7+ years building and scaling SaaS platforms (thousands of users, millions of records, $1B+ GTV). Angular, Next.js, NestJS, MongoDB. Clean architecture, multi-tenancy, RBAC, CI/CD.",
  keywords: [
    "Ashwin Sathian",
    "Full-Stack Engineer",
    "Angular",
    "NestJS",
    "Next.js",
    "Nx Monorepo",
    "MongoDB",
    "SaaS",
    "RBAC",
    "Multi-tenant",
    "CI/CD",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ashwin Sathian — Full-Stack Engineer",
    description:
      "Engineering leader with 7+ years building and scaling SaaS platforms. Angular • NestJS • Next.js • MongoDB • Nx • CI/CD.",
    url: "https://ashwin-smoky.vercel.app/",
    siteName: "Ashwin Sathian — Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Sathian — Full-Stack Engineer",
    description:
      "Angular • NestJS • Next.js • MongoDB • Nx • CI/CD. 7+ years building modular SaaS platforms.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-gray-900 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
