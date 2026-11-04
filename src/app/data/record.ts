// Home "Record" section. Every sentence and figure here restates a claim
// already made in experience.ts or the résumé; nothing new is asserted.
export const RECORD = {
  paragraphs: [
    "I joined Penny Software as a founding engineer and stayed five years while it grew into a procurement platform with $1B+ in GTV. I designed its RBAC and multi-tenant security from scratch. Later I owned Funnels, Websites, and Webinars at HighLevel for four months.",
    "Penny Software’s Vendor Pre-Qualification System began as one customer vetting vendors by hand. I sat with them, wrote the spec, and built it from schema to UI.",
  ],
  figures: [
    { value: "$1B+", label: "GTV the Penny Software platform grew to" },
    { value: "5 years", label: "as a founding engineer at Penny Software" },
    { value: "12-person", label: "team mentored while owning platform architecture" },
    { value: "Sub-200ms", label: "queries held at that scale" },
  ],
  footnote:
    "B.Tech, Electronics & Communication Engineering, NIT Calicut. Based in Kochi, Kerala, India.",
} as const;
