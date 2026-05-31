export const metadata = {
  title: "About Us",
  description:
    "Learn about ABGCC — a premier platform dedicated to fostering commercial relationships, strategic partnerships, and economic collaboration between the United States and the Balkans.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ABGCC",
    description:
      "A strategic bridge between the Balkans and the United States — learn about our mission, team, and core pillars.",
    url: "/about",
  },
};

import "@/styles/aboutus.css";
import Image from "next/image";
import HeroVideo from "@/components/HeroVideo";

import { Reveal, RevealWords, RevealLine, Stagger, StaggerItem } from "@/components/MotionReveal";

const team = [
  {
    name: "Eliza Prendzov - President",
    role: "CEO & Co-Founder of Prend Capital",
    image: "/Eliza-Prendzov.webp",
    imageClass:"team-img-eliza",
    bio: "A leader in sustainable finance and infrastructure partnership building, with over 20 years of experience across consulting, asset management, finance, sustainability, government, and multilateral relations.",
    linkedin:"https://www.linkedin.com/in/eliza-prendzov/"
  },
  {
    name: "Lenard Moxley - Managing Director",
    role: "Renewable Energy and Infrastructure",
    image: "/Lenard Moxley.webp",
    imageClass:"team-img-lenard",
    bio: "Comes from a renewable energy development and policy background, with experience in wind, solar, and battery storage. He speaks Macedonian fluently and has strong international experience.",
    linkedin:"https://www.linkedin.com/in/lenardcmoxley/"
  },
  {
    name: "Charles Moxley - Managing Director",
    role: "Finance & Capital Markets",
    image: "/Charles Moxley.webp",
    imageClass:"team-img-charles",
    bio: "A finance professional with experience in asset management, financial analysis, capital markets, electricity, and energy markets.",
    linkedin:"https://www.linkedin.com/in/charlesdmoxley/"
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
      <section className="page-hero">
        <HeroVideo video="/About.mp4" poster="/AboutPoster.webp" />

        <div className="page-hero-overlay" />

        <div className="page-hero-shell">
          <div className="page-hero-content">
            <Reveal delay={0.05}>
              <p className="page-hero-eyebrow">About ABGCC</p>
            </Reveal>

            <Reveal delay={0.12}>
              <h1 className="page-hero-title title-dark">
                <RevealWords delay={0.16} wordDelay={0.065}>
                  A strategic bridge between the Balkans and the United States
                </RevealWords>
              </h1>
            </Reveal>
          </div>
        </div>

        <div className="page-hero-bottom-text">
          <Reveal delay={0.22}>
            <span>
              The American Balkan Global Chamber of Commerce is a premier
              platform dedicated to fostering commercial relationships,
              strategic partnerships, and economic collaboration between the
              United States, the Balkans, and global markets.
            </span>
          </Reveal>
        </div>
      </section>

      <section className="about-intro">
        <div className="page-container about-grid">
          <Reveal>
            <span className="section-label">Who we are</span>

            <h2>
              A platform for investment, innovation, and opportunity.
            </h2>

            <RevealLine delay={0.3} style={{ marginTop: "1.5rem" }} />
          </Reveal>

          <Reveal delay={0.08} className="intro-content">
            <p>
             ABGCC serves American companies seeking opportunities in the Balkan markets, 
Balkan-based businesses expanding into North America, and globally, as well as 
Balkan-American entrepreneurs building across both regions. 
            </p>

            <p>
              Through curated 
events, B2B matchmaking, investment forums, conferences, and one-on-one 
support, ABGCC creates high-value connections for companies, founders, investors, 
and institutions. 
            </p>
          </Reveal>
        </div>
      </section>

      <section className="industries-section">
        <div className="page-container">
          <Reveal className="section-heading">
            <span className="section-label">Industries</span>
            <h2>Serving a wide range of sectors.</h2>
          </Reveal>

          <Stagger className="industries-card-grid">
            {industries.map((industry) => (
              <StaggerItem className="industry-card" key={industry.title}>
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
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      
       <section className="vision-section">
        <div className="page-container">
          <Reveal className="vision-card">
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
          </Reveal>
        </div>
      </section>

      <section className="team-section">
        <div className="page-container">
          <Reveal className="section-heading">
            <span className="section-label">Meet the Team</span>
            
          </Reveal>

          <Stagger className="team-grid">
            {team.map((person) => (
              <StaggerItem className="team-card" key={person.name}>
                <div className="team-image-wrap">
                  <Image
                  
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                     className={`team-img ${person.imageClass}`}
                  />
                </div>

                <div className="team-info">
                  <h3>{person.name}</h3>
                  <span>{person.role}</span>
                  <a
  href={person.linkedin}
  target="_blank"
  rel="noopener noreferrer"
  className="team-linkedin"
>
  LinkedIn Profile
</a>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="pillars-section">
        <div className="page-container">
          <Reveal className="section-heading">
            <span className="section-label">Our Core Pillars</span>

            <h2>
              Built around growth, access, and serious commercial relationships.
            </h2>
          </Reveal>

          <Stagger className="pillars-grid">
            {pillars.map((pillar, index) => (
              <StaggerItem className="pillar-card" key={pillar.title}>
                <span>0{index + 1}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

     
    </main>
  );
}