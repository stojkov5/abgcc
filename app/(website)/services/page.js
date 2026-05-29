import Image from "next/image";
import "@/styles/services.css";
import HeroVideo from "@/components/HeroVideo";
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
    text: "We host cultural events that showcase the rich heritage of the Balkans, including concerts and special programs featuring some of the region's leading artists and musicians.",
  },
];

export default function ServicesPage() {
  return (
    <main className="services-page">
      <section className="page-hero">
       <HeroVideo video="/Services.mp4" poster="/ServicesPoster.webp" />
        

        {/* <div className="page-hero-overlay" /> */}

        <div className="page-hero-shell">
          <div className="page-hero-content">
            <p className="page-hero-eyebrow">Services</p>

            <h1 className="page-hero-title ">
              Strategic access, curated connection, and cultural exchange.
            </h1>
          </div>
        </div>

        <div className="page-hero-bottom-text">
          <span>
            ABGCC creates high-value opportunities for members to connect with
            business leaders, investors, executives, and cultural voices across
            the United States, the Balkans, and global markets.
          </span>
        </div>
      </section>

      <section className="services-section">
        <div className="page-container">
          <div className="section-heading services-heading">
            <span className="section-label">What We Offer</span>

            <h2>
              High-value opportunities designed to create meaningful business
              relationships and long-term growth.
            </h2>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <span className="service-number">{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}