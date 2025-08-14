import React from "react";
import Head from "next/head";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Head>
        <title>Ashwin Sathian | Full Stack Developer</title>
        <meta
          name="description"
          content="Ashwin Sathian - Full Stack Developer specializing in Angular, Node.js, and NestJS with 6+ years of SaaS experience."
        />
      </Head>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen px-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          Ashwin Sathian
        </h1>
        <p className="text-xl sm:text-2xl mt-4 text-gray-400">
          Full Stack Developer • SaaS Specialist
        </p>
        <div className="flex gap-6 mt-6 text-blue-400 text-lg">
          <a
            href="mailto:ashwinsathyan19@gmail.com"
            className="hover:underline"
          >
            Email
          </a>
          <a
            href="https://linkedin.com/in/ashwinsathian"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/AshwinSathian"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Summary */}
      <section className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800">
        <h2 className="text-3xl font-semibold mb-4">About Me</h2>
        <p className="leading-relaxed text-gray-300 text-lg">
          Results-driven Full Stack Developer with 6+ years in SaaS application
          development, specializing in Angular, Node.js, and NestJS. Adept at
          building scalable web applications and cloud-based solutions, leading
          engineering teams, and delivering impactful, customer-focused
          products.
        </p>
      </section>

      {/* Skills */}
      <section className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800">
        <h2 className="text-3xl font-semibold mb-8">Skills</h2>
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
      </section>

      {/* Experience */}
      <section className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800">
        <h2 className="text-3xl font-semibold mb-8">Experience</h2>
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
      </section>

      {/* Education */}
      <section className="px-6 py-16 max-w-4xl mx-auto border-t border-gray-800">
        <h2 className="text-3xl font-semibold mb-8">Education</h2>
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
      </section>

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
