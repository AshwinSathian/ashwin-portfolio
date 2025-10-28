export default function Head() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ashwin Sathian",
    jobTitle: "Full-Stack Engineer",
    url: "https://ashwinsathian.com/",
    email: "mailto:ashwinsathyan19@gmail.com",
    sameAs: [
      "https://www.linkedin.com/in/ashwinsathian",
      "https://github.com/AshwinSathian",
    ],
    knowsAbout: [
      "Angular",
      "Next.js",
      "NestJS",
      "Node.js",
      "TypeScript",
      "MongoDB",
      "Nx",
      "CI/CD",
      "AWS",
      "GCP",
    ],
  };

  // ✅ Add SearchAction so RRT detects a supported rich result (“Sitelinks searchbox”)
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://ashwinsathian.com/",
    name: "Ashwin Sathian — Portfolio",
    publisher: { "@type": "Person", name: "Ashwin Sathian" },
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.google.com/search?q=site%3Aashwin-smoky.vercel.app%20{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: "https://ashwinsathian.com/",
    about: {
      "@type": "Person",
      name: "Ashwin Sathian",
      url: "https://ashwinsathian.com/",
      sameAs: [
        "https://www.linkedin.com/in/ashwinsathian",
        "https://github.com/AshwinSathian",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
      />
    </>
  );
}
