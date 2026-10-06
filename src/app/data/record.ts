// Home "Record" section. Every sentence and figure here restates a claim
// already made in experience.ts or the résumé; nothing new is asserted.
export const RECORD = {
  paragraphs: [
    "I was a founding engineer at Penny Software for five years, taking it from zero to a procurement platform that grew to $1B+ in GTV. I designed its RBAC and multi-tenant security from scratch. HighLevel followed, for a short stretch owning Funnels, Websites, and Webinars.",
    "A customer's ask rarely arrives as a spec. I write it myself, then build against it end to end. Penny Software's Vendor Pre-Qualification System is the clearest example. It started as one customer's manual process and one conversation with me, and it ended as shipped software, schema to UI, built and owned alone.",
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
