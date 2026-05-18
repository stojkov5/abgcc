import "../../styles/aboutus.css";
import Image from "next/image";

const team = [
  {
    name: "Eliza Prendzov",
    role: "CEO & Co-Founder of Prend Capital",
    image: "/Eliza-Prendzov.webp",
    bio: "A leader in sustainable finance and infrastructure partnership building, with over 20 years of experience across consulting, asset management, finance, sustainability, government, and multilateral relations.",
  },
  {
    name: "Lenard Moxley",
    role: "Renewable Energy & Policy",
    image: "/Lenard Moxley.webp",
    bio: "Comes from a renewable energy development and policy background, with experience in wind, solar, and battery storage. He speaks Macedonian fluently and has strong international experience.",
  },
  {
    name: "Charles Moxley",
    role: "Finance & Capital Markets",
    image: "/Charles Moxley.webp",
    bio: "A finance professional with experience in asset management, financial analysis, capital markets, electricity, and energy markets.",
  },
];

const industries = [
  { title: "Agrofood", image: "/about/agrofood.webp" },
  { title: "Banking & Finance", image: "/about/banking.webp" },
  { title: "Technology", image: "/about/technology.webp" },
  { title: "Law", image: "/about/law.webp" },
  { title: "Consulting", image: "/about/consulting.webp" },
  { title: "Renewable Energy", image: "/about/energy.webp" },
  { title: "Real Estate", image: "/about/realestate.webp" },
  { title: "Luxury", image: "/about/luxury.webp" },
];

const pillars = [
  {
    title: "Investment & Connections",
    text: "Facilitating strategic relationships between investors, businesses, institutions, and industry leaders.",
  },
  {
    title: "Market Entry",
    text: "Helping companies enter and scale within new markets through advisory support, local expertise, and trusted networks.",
  },
  {
    title: "Growth Network",
    text: "Building a collaborative ecosystem for mentorship, business development, innovation, and long-term professional relationships.",
  },
  {
    title: "Strategic Business Bridge",
    text: "Strengthening commercial, economic, and cultural ties between the United States, the Balkans, and global partners.",
  },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <Image
          src="/About.webp"
          alt="About American Balkan Global Chamber of Commerce"
          fill
          priority
          className="about-hero-img"
        />

        <div className="about-hero-overlay" />

        <div className="page-hero-shell">
  <div className="about-hero-content page-hero-content">
            <p className="about-eyebrow">About ABGCC</p>

            <h1 className="about-title">
              A strategic bridge between the Balkans and the United States.
            </h1>

            <p className="about-hero-text mx-auto">
              The American Balkan Global Chamber of Commerce is a premier
              platform dedicated to fostering commercial relationships,
              strategic partnerships, and economic collaboration between the
              United States, the Balkans, and global markets.
            </p>
          </div>
        </div>
      </section>

      <section className="about-intro">
        <div className="about-container about-grid">
          <div>
            <span className="section-label">Who we are</span>
            <h2>
              Connecting business through investment, innovation, and
              opportunity.
            </h2>
          </div>

          <div className="intro-content">
            <p>
              ABGCC serves American companies seeking opportunities in Balkan
              markets, Balkan-based businesses expanding into North America, and
              Balkan-American entrepreneurs building across both regions.
            </p>

            <p>
              Through curated events, B2B matchmaking, investment forums,
              conferences, and one-on-one support, ABGCC creates high-value
              connections for companies, founders, investors, and institutions.
            </p>
          </div>
        </div>
      </section>

      <section className="industries-section">
        <div className="about-container">
          <div className="section-heading">
            <span className="section-label">Industries</span>
            <h2>Serving a wide range of sectors.</h2>
          </div>

          <div className="industries-card-grid">
            {industries.map((industry) => (
              <article className="industry-card" key={industry.title}>
                <div className="industry-image">
                  <Image
                    src={industry.image}
                    alt={industry.title}
                    fill
                    className="industry-img"
                  />
                </div>

                <div className="industry-content">
                  <h3>{industry.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="about-container">
          <div className="section-heading">
            <span className="section-label">Meet the Team</span>
            <h2>Leadership with global experience.</h2>
          </div>

          <div className="team-grid">
            {team.map((person) => (
              <article className="team-card" key={person.name}>
                <div className="team-image-wrap">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="team-img"
                  />
                </div>

                <div className="team-info">
                  <h3>{person.name}</h3>
                  <span>{person.role}</span>
                  <p>{person.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pillars-section">
        <div className="about-container">
          <div className="section-heading">
            <span className="section-label">Our Core Pillars</span>
            <h2>
              Built around growth, access, and serious commercial relationships.
            </h2>
          </div>

          <div className="pillars-grid">
            {pillars.map((pillar, index) => (
              <article className="pillar-card" key={pillar.title}>
                <span>0{index + 1}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vision-section">
        <div className="about-container">
          <div className="vision-card">
            <span className="section-label">Our Vision</span>

            <h2>
              A globally connected network advancing economic development across
              the Atlantic and beyond.
            </h2>

            <p>
              We envision businesses, investors, and institutions working
              together to strengthen regional cooperation and create sustainable
              prosperity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}