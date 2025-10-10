"use client";

import React from "react";
import Head from "next/head";
import Hero from "@/components/hero/Hero";
import ContactCard from "@/components/hero/ContactCard";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import Experience from "@/components/experience/Experience";
import Education from "@/components/education/Education";
import SiteFooter from "@/components/footer/SiteFooter";
import PageSection from "@/components/layout/PageSection";
import SectionHeading from "@/components/layout/SectionHeading";

export default function Page() {
  return (
    <>
      <Head>
        <title>Ashwin Sathian</title>
        <meta
          name="description"
          content="Engineering leader with 7+ years building and scaling SaaS platforms (thousands of users, millions of records, ~$1B+ GTV). Angular, Next.js, NestJS, MongoDB, Nx, CI/CD."
        />
        <link rel="canonical" href="https://ashwin-smoky.vercel.app/" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <meta property="og:title" content="Ashwin Sathian" />
        <meta
          property="og:description"
          content="Engineering leader focused on SaaS architecture — Angular • Next.js • NestJS • MongoDB • Nx • CI/CD."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ashwin-smoky.vercel.app/" />
        <meta property="og:image" content="/preview.png" />
        <meta
          property="og:image:alt"
          content="Full-Stack Engineer • SaaS Architecture • Angular • Next.js • NestJS • MongoDB • TypeScript"
        />
        <meta property="og:site_name" content="Ashwin Sathian" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ashwin Sathian" />
        <meta
          name="twitter:description"
          content="Full-Stack Engineer • SaaS Architecture • Angular • Next.js • NestJS • MongoDB • TypeScript"
        />
        <meta name="twitter:image" content="/preview.png" />
      </Head>

      <main className="bg-gray-900 text-white min-h-screen font-sans">
        <PageSection
          id="home"
          labelledBy="hero-heading"
          className="flex flex-col items-center justify-center text-center min-h-screen px-6"
        >
          <Hero />
          <ContactCard />
        </PageSection>

        <PageSection
          id="about"
          labelledBy="about-heading"
          className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
        >
          <SectionHeading id="about-heading" title="About Me" className="mb-4" />
          <About />
        </PageSection>

        <PageSection
          id="skills"
          labelledBy="skills-heading"
          className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
        >
          <SectionHeading id="skills-heading" title="Skills" className="mb-8" />
          <Skills />
        </PageSection>

        <PageSection
          id="experience"
          labelledBy="experience-heading"
          className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
        >
          <SectionHeading
            id="experience-heading"
            title="Experience"
            className="mb-8"
          />
          <Experience />
        </PageSection>

        <PageSection
          id="education"
          labelledBy="education-heading"
          className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
        >
          <SectionHeading
            id="education-heading"
            title="Education"
            className="mb-8"
          />
          <Education />
        </PageSection>

        <SiteFooter />
      </main>
    </>
  );
}
