export const metadata = {
  title: "Services",
  description:
    "ABGCC offers curated B2B meetings, industry conferences, and cultural events — strategic access, curated connection, and cultural exchange across the US and Balkans.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | ABGCC",
    description:
      "High-value opportunities designed to create meaningful business relationships and long-term growth between the US and the Balkans.",
    url: "/services",
  },
};

import Image from "next/image";
import "@/styles/services.css";
import HeroVideo from "@/components/HeroVideo";
import { Reveal, RevealWords, Stagger, StaggerItem, RevealLine } from "@/components/MotionReveal";

const services = [
  {
    number: "01",
    title: "Curated B2B Meetings",
    text: "We host forums where our members can connect directly with CEOs and executives from some of the Balkans' leading companies across a variety of industries, including real estate, luxury real estate, infrastructure, renewable energy and BESS, AI & telecom, pharma, metals, mining, and more. Through these events, we help investment and industry professionals gain exposure to the emerging trends shaping Balkan and global markets. These events are deal-oriented and commercial.",
  },
  {
    number: "02",
    title: "Larger Industry Conferences and Networking Events",
    text: "We host events for professionals at all stages in their careers, from entry-level professionals to seasoned executives. These range from casual networking events and happy hours to larger industry-focused conferences and forums.",
  },
  {
    number: "03",
    title: "Cultural Events",
    text: "We host cultural events that showcase the rich heritage of the Balkans, including concerts and special programs featuring some of the region's leading artists and musicians. In April, we hosted world-renowned Macedonian pianist Simon Trpčeski with the Palm Beach Symphony at the Kravis Center for Performing Arts in West Palm Beach, Florida, for a post-concert VIP reception in the Founders Room for our distinguished guests and the symphony's patrons, in partnership with the West Palm Beach Symphony. Simon Trpčeski's performance showcases ABGCC's promotion of the cultural and business ties that unite our regions.",
  },
];

export default function ServicesPage() {
  return (
    <main className="services-page">
      <section className="page-hero">
        <HeroVideo video="/Services.mp4" poster="/ServicesPoster.webp" />

        <div className="page-hero-shell">
          <div className="page-hero-content">
            <Reveal delay={0.05}>
              <p className="page-hero-eyebrow">Services</p>
            </Reveal>

            <Reveal delay={0.14}>
              <h1 className="page-hero-title">
                <RevealWords delay={0.18}>
                  Strategic access, curated connection, and cultural exchange.
                </RevealWords>
              </h1>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.3} y={12}>
          <div className="page-hero-bottom-text">
            <span>
              ABGCC creates high-value opportunities for members to connect with
              business leaders, investors, executives, and cultural voices across
              the United States, the Balkans, and global markets.
            </span>
          </div>
        </Reveal>
      </section>

      <section className="services-section">
        <div className="page-container">
          <div className="section-heading services-heading">
            <Reveal delay={0}>
              <span className="section-label">What We Offer</span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2>
                High-value opportunities designed to create meaningful business
                relationships and long-term growth.
              </h2>
            </Reveal>

            <Reveal delay={0.18}>
              <RevealLine style={{ marginTop: "2rem" }} delay={0.3} />
            </Reveal>
          </div>

          <Stagger className="services-grid" staggerDelay={0.14}>
            {services.map((service) => (
              <StaggerItem className="service-card" key={service.number}>
                <span className="service-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </main>
  );
}
