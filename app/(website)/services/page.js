export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import "@/styles/services.css";

export default function ServicesPage() {
  return (
    <main className="services-page">
      <section className="services-hero">
        <Image
          src="/Landing.webp"
          alt="ABGCC Services"
          fill
          priority
          className="services-hero-img"
        />

        <div className="services-hero-overlay" />

        <div className="services-hero-content">
          <p className="services-eyebrow">
            American Balkan Global Chamber of Commerce
          </p>

          <h1>Services</h1>

          <p className="services-description">
            We are currently preparing a full range of strategic business,
            investment, and market-entry services for our members and partners.
          </p>

          <div className="services-coming-soon">
            <span />
            <p>Coming Soon</p>
            <span />
          </div>
        </div>
      </section>
    </main>
  );
}