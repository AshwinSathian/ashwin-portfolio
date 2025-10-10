"use client";

import React from "react";
import Head from "next/head";
import About from "@/components/about/About";
import Education from "@/components/education/Education";
import Experience from "@/components/experience/Experience";
import SiteFooter from "@/components/footer/SiteFooter";
import ContactCard from "@/components/hero/ContactCard";
import Hero from "@/components/hero/Hero";
import PageSection from "@/components/layout/PageSection";
import SectionHeading from "@/components/layout/SectionHeading";
import Skills from "@/components/skills/Skills";
import { ABOUT } from "@/data/about";
import { EDUCATION_HEADING } from "@/data/education";
import { EXPERIENCE_HEADING } from "@/data/experience";
import { SKILLS_HEADING } from "@/data/skills";

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
          <SectionHeading
            id="about-heading"
            title={ABOUT.heading}
            className="mb-4"
          />
          <About />
        </PageSection>

        <PageSection
          id="skills"
          labelledBy="skills-heading"
          className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
        >
          <SectionHeading
            id="skills-heading"
            title={SKILLS_HEADING}
            className="mb-8"
          />
          <Skills />
        </PageSection>

        <PageSection
          id="experience"
          labelledBy="experience-heading"
          className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
        >
          <SectionHeading
            id="experience-heading"
            title={EXPERIENCE_HEADING}
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
            title={EDUCATION_HEADING}
            className="mb-8"
          />
          <Education />
        </PageSection>

        <SiteFooter />
      </main>
    </>
  );
}
