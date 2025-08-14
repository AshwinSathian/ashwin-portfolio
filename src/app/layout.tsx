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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Ashwin Sathian",
  alternates: { canonical: siteUrl },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml", rel: "icon" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Ashwin Sathian",
    title,
    description,
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Ashwin Sathian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/preview.png"],
  },
  themeColor: "#0b1220",
  viewport: { width: "device-width", initialScale: 1, maximumScale: 5 },
  robots: { index: true, follow: true },
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
