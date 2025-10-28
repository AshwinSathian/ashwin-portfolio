import type { Metadata } from "next";
import { Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/md-dark-deeppurple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import PrimeProvider from "@/components/providers/PrimeProvider";

const plusJakarta = Open_Sans({
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

export const metadata: Metadata = {
  metadataBase: new URL("https://ashwin-smoky.vercel.app"),
  title: {
    default: "Ashwin Sathian — Full-Stack Engineer (Angular • NestJS • Nx)",
    template: "%s — Ashwin Sathian",
  },
  description:
    "Engineering leader with 7+ years building and scaling SaaS platforms (thousands of users, millions of records, ~$1B+ GTV). Angular, Next.js, NestJS, MongoDB, Nx, CI/CD.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://ashwinsathian.com/",
    title: "Ashwin Sathian — Full-Stack Engineer",
    description:
      "Engineering leader with 7+ years building and scaling SaaS platforms (thousands of users, millions of records, ~$1B+ GTV). Angular, Next.js, NestJS, MongoDB, Nx, CI/CD.",
    siteName: "Ashwin Sathian — Portfolio",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Ashwin Sathian portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Sathian — Full-Stack Engineer",
    description:
      "Engineering leader with 7+ years building and scaling SaaS platforms (thousands of users, millions of records, ~$1B+ GTV). Angular, Next.js, NestJS, MongoDB, Nx, CI/CD.",
    images: ["/preview.png"],
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
    apple: "/apple-touch-icon.png", // add this file if you want
  },
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
      <body className="bg-gray-900 text-white antialiased min-h-screen font-sans">
        <PrimeProvider>{children}</PrimeProvider>
      </body>
    </html>
  );
}
