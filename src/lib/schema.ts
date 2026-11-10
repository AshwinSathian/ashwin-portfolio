import { PROJECTS } from "../data/projects";
import { SITE } from "../data/site";
import { capitalize, numberWord } from "./text";

const id = SITE.website;

// Longer form for the Person and WebSite schema. Facts match the visible pages.
export const personDescription = `Senior full-stack engineer with eight years of experience. Founding engineer at Penny Software for five of them, taking it from zero to a procurement platform that grew to $1B+ in GTV. ${capitalize(numberWord(PROJECTS.length))} independent products shipped on his own time.`;

export const siteDescription =
  "Ashwin Sathian, senior full-stack engineer in Kochi. Five years as founding engineer at Penny Software, a procurement platform that grew to $1B+ GTV.";

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${id}/#person`,
  name: SITE.name,
  url: id,
  email: `mailto:${SITE.email}`,
  description: personDescription,
  sameAs: [SITE.linkedin, SITE.github],
  jobTitle: "Senior Full-Stack Engineer",
  homeLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Kochi", addressRegion: "Kerala", addressCountry: "IN" } },
  // Past affiliations only: no current employer is stated.
  alumniOf: [
    { "@type": "EducationalOrganization", name: "National Institute of Technology Calicut" },
    { "@type": "Organization", name: "Penny Software" },
    { "@type": "Organization", name: "HighLevel" },
  ],
  knowsAbout: [
    "SaaS platform architecture", "Multi-tenant platforms", "System design", "Angular", "React", "Next.js",
    "NestJS", "Node.js", "MongoDB", "TypeScript", "AWS", "GCP", "Docker", "GitHub Actions", "Go", "Astro",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${id}/#website`,
  name: SITE.name,
  url: id,
  author: { "@id": `${id}/#person` },
  publisher: { "@id": `${id}/#person` },
  description: personDescription,
  inLanguage: "en-US",
};

export const breadcrumbs = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${id}${path}`,
  })),
});

/** A list page: a CollectionPage whose mainEntity is an ItemList of its children. */
export const collectionPage = (path: string, name: string, description: string, items: { name: string; path: string }[], type: "CollectionPage" | "Blog" = "CollectionPage") => ({
  "@context": "https://schema.org",
  "@type": type,
  "@id": `${id}${path}#page`,
  url: `${id}${path}`,
  name,
  description,
  inLanguage: "en-US",
  isPartOf: { "@id": `${id}/#website` },
  author: { "@id": `${id}/#person` },
  ...(type === "Blog" ? { publisher: { "@id": `${id}/#person` } } : {}),
  mainEntity: {
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: `${id}${it.path}` })),
  },
});
