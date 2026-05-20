import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PartnerSection from "../components/landing/PartnerSection";
import MissionSection from "../components/landing/MissionSection";
import EventsPreview from "../components/landing/EventsPreview";
import MembershipCTA from "../components/landing/MembershipCTA";
import "../styles/home.css";

import { HeroReveal, HeroItem } from "@/components/MotionReveal";

export default function Home() {
  return (
    <main className="home-page">
      <section className="page-hero">
        <Image
          src="/Landing.webp"
          alt="American Balkan Global Chamber of Commerce"
          fill
          priority
          className="page-hero-img"
        />

        <div className="page-hero-overlay" />

        <div className="page-hero-shell">
          <HeroReveal className="page-hero-content">
            <HeroItem as="p" className="page-hero-eyebrow">
              American Balkan Global Chamber of Commerce
            </HeroItem>

            <HeroItem as="h1" className="page-hero-title">
              Connecting Balkan and
              <br />
              American business.
            </HeroItem>

            <HeroItem>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/membership" className="primary-hero-btn">
                  Become a Member <ArrowRight size={17} />
                </Link>

                <Link href="/about" className="secondary-hero-btn">
                  Learn More
                </Link>
              </div>
            </HeroItem>
          </HeroReveal>
        </div>

        <div className="page-hero-bottom-text">
          ABGCC strengthens commercial relationships, strategic partnerships,
          and economic collaboration between the United States, the Balkans, and
          global partners.
        </div>
      </section>

      <PartnerSection />
      <MissionSection />
      <EventsPreview />
      <MembershipCTA />
    </main>
  );
}