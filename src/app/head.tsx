// app/head.tsx
export default function Head() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ashwin Sathian",
    jobTitle: "Full-Stack Engineer",
    url: "https://ashwin-smoky.vercel.app/",
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

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://ashwin-smoky.vercel.app/",
    name: "Ashwin Sathian — Portfolio",
    publisher: { "@type": "Person", name: "Ashwin Sathian" },
  };

  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: "https://ashwin-smoky.vercel.app/",
    about: {
      "@type": "Person",
      name: "Ashwin Sathian",
      url: "https://ashwin-smoky.vercel.app/",
      sameAs: [
        "https://www.linkedin.com/in/ashwinsathian",
        "https://github.com/AshwinSathian",
      ],
    },
    // Optional: if you later add a profile image at /ashwin.jpg
    // primaryImageOfPage: "https://ashwin-smoky.vercel.app/ashwin.jpg"
  };

  return (
    <>
      {/* Keep any meta from layout.tsx; this only adds JSON-LD */}
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
