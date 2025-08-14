"use client";

import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaUser,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const stagger = {
  hidden: { opacity: 0, y: 6 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.35 },
  }),
};

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Head>
        <title>Ashwin Sathian</title>
        <meta
          name="description"
          content="Ashwin Sathian - Full Stack Developer specializing in Angular, Node.js, and NestJS with 6+ years of SaaS experience."
        />
        {/* Canonical */}
        <link rel="canonical" href="https://ashwin-smoky.vercel.app/" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />

        {/* Open Graph */}
        <meta property="og:title" content="Ashwin Sathian" />
        <meta
          property="og:description"
          content="SaaS-focused Full Stack Developer (Angular, Node.js, NestJS). Minimal portfolio with experience, skills, and contact."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ashwin-smoky.vercel.app/" />
        <meta property="og:image" content="/preview.png" />
        <meta
          property="og:image:alt"
          content="Full Stack Developer • SaaS Specialist • Angular • Node.js • NestJS • MongoDB • Typescript"
        />
        <meta property="og:site_name" content="Ashwin Sathian" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ashwin Sathian" />
        <meta
          name="twitter:description"
          content="Full Stack Developer • SaaS Specialist • Angular • Node.js • NestJS • MongoDB • Typescript"
        />
        <meta name="twitter:image" content="/preview.png" />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
      </Head>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen px-6">
        <motion.h1
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-5xl sm:text-6xl font-extrabold tracking-tight"
        >
          Ashwin Sathian
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-xl sm:text-2xl mt-4 text-gray-400"
        >
          Full Stack Developer • SaaS Specialist
        </motion.p>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 rounded-xl border border-gray-800 bg-gray-800/50 backdrop-blur px-5 py-4"
        >
          <ul className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <motion.li
              variants={stagger}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <a
                href="mailto:ashwinsathyan19@gmail.com"
                aria-label="Email Ashwin Sathian"
                className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <FaEnvelope aria-hidden />
                Email
              </a>
            </motion.li>

            <motion.li
              variants={stagger}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <a
                href="https://linkedin.com/in/ashwinsathian"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Ashwin's LinkedIn"
                className="inline-flex items-center gap-2 rounded-md border border-blue-400/40 px-4 py-2 text-sm font-medium text-blue-300 transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
              >
                <FaLinkedin aria-hidden />
                LinkedIn
              </a>
            </motion.li>

            <motion.li
              variants={stagger}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <a
                href="https://github.com/AshwinSathian"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Ashwin's GitHub"
                className="inline-flex items-center gap-2 rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500/60"
              >
                <FaGithub aria-hidden />
                GitHub
              </a>
            </motion.li>
          </ul>
        </motion.div>
      </section>

      {/* About Me */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
      >
        <h2 className="text-3xl font-semibold mb-4 flex items-center gap-3">
          <FaUser className="text-blue-400" /> About Me
        </h2>
        <p className="leading-relaxed text-gray-300 text-lg">
          Results-driven Full Stack Developer with 6+ years in SaaS application
          development, specializing in Angular, Node.js, and NestJS. Adept at
          building scalable web applications and cloud-based solutions, leading
          engineering teams, and delivering impactful, customer-focused
          products.
        </p>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
      >
        <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
          <FaTools className="text-blue-400" /> Skills
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-gray-300">
          <div>
            <h3 className="font-semibold text-white mb-1">Frontend</h3>
            <p>Angular, React.js, Next.js</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Backend</h3>
            <p>Node.js, NestJS, Express.js</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Database</h3>
            <p>MongoDB, AWS DynamoDB</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Languages</h3>
            <p>TypeScript, JavaScript, HTML, CSS, Python</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Cloud & DevOps</h3>
            <p>AWS, GCP</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Tools</h3>
            <p>Git, Docker, Postman, Jira, CI/CD</p>
          </div>
        </div>
      </motion.section>

      {/* Experience */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
      >
        <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
          <FaBriefcase className="text-blue-400" /> Experience
        </h2>
        <div className="space-y-8">
          {[
            {
              role: "Lead Engineer",
              company: "Penny Software",
              period: "Jan 2024 – Present",
              points: [
                "Led product development, defining technical strategy and roadmap.",
                "Architected scalable systems using Angular, NestJS, and MongoDB.",
                "Implemented RBAC and optimized multi-tenant security.",
                "Mentored engineers to foster a high-performance culture.",
              ],
            },
            {
              role: "Product Specialist",
              company: "Penny Software",
              period: "Apr 2022 – Dec 2023",
              points: [
                "Managed feature development aligned with business goals.",
                "Led collaboration across engineering, QA, DevOps, and business teams.",
                "Optimized database queries and API performance.",
              ],
            },
            {
              role: "Full Stack Developer",
              company: "Penny Software",
              period: "Jun 2020 – Mar 2022",
              points: [
                "Built and enhanced SaaS features across the full stack.",
                "Designed responsive UI components using Angular.",
              ],
            },
            {
              role: "Senior Full Stack Developer",
              company: "Manaraah",
              period: "Jan 2020 – Jun 2020",
              points: [
                "Delivered end-to-end development of business applications.",
                "Translated client requirements into scalable technical solutions.",
              ],
            },
            {
              role: "Software Development Engineer",
              company: "WeCP",
              period: "Jan 2019 – Jan 2020",
              points: [
                "Built SaaS-based assessment platforms.",
                "Mentored junior developers.",
              ],
            },
            {
              role: "Junior Programmer",
              company: "Reubro International",
              period: "Aug 2018 – Jan 2019",
              points: ["Developed and maintained flagship SaaS products."],
            },
          ].map((job, idx) => (
            <div
              key={idx}
              className="hover:bg-gray-800 p-6 rounded-lg transition-colors"
            >
              <h3 className="font-semibold text-white text-xl">
                {job.role} | {job.company}
              </h3>
              <p className="text-sm text-gray-400">{job.period}</p>
              <ul className="list-disc pl-5 mt-2 text-gray-300 space-y-1">
                {job.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Education */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800"
      >
        <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3">
          <FaGraduationCap className="text-blue-400" /> Education
        </h2>
        <div className="text-gray-300 space-y-4">
          <div>
            <p className="font-semibold text-white">
              National Institute of Technology Calicut
            </p>
            <p>
              B.Tech., Electronics & Communication Engineering | 2014 – 2018
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Indian School Darsait</p>
            <p>Class XII (PCM + CS) | 2012 – 2014</p>
            <p>Class X | 2010 – 2012</p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-gray-800 text-gray-500 text-sm">
        <a
          href="/Ashwin_Sathian_Resume.pdf"
          download
          className="text-blue-400 hover:underline"
        >
          Download Resume (PDF)
        </a>
        <p className="mt-2">© {new Date().getFullYear()} Ashwin Sathian</p>
      </footer>
    </div>
  );
}
