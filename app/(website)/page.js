import Link from "next/link";
import { ArrowRight } from "lucide-react";

import PartnerSection from "../../components/landing/PartnerSection";
import MissionSection from "../../components/landing/MissionSection";
import EventsPreview from "../../components/landing/EventsPreview";
import MembershipCTA from "../../components/landing/MembershipCTA";
import HeroVideo from "../../components/HeroVideo";

import "@/styles/home.css";

import { Reveal, RevealWords, FadeIn } from "../../components/MotionReveal";

export default function Home() {
  return (
    <main className="home-page">
      <section className="page-hero">
        <HeroVideo video="/Landing.mp4" poster="/LandingPoster.webp" />

        <div className="page-hero-shell">
          <div className="page-hero-content">
            <Reveal delay={0.08} y={14}>
              <p className="page-hero-eyebrow">American Balkan Global Chamber of Commerce</p>
            </Reveal>

            <Reveal delay={0.18}>
              <h1 className="page-hero-title">
                <RevealWords delay={0.22} wordDelay={0.07}>
                  American Balkan Global Chamber of Commerce
                </RevealWords>
              </h1>
            </Reveal>

            <Reveal delay={0.55}>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/membership" className="primary-hero-btn">
                  Become a Member <ArrowRight size={17} />
                </Link>

                <Link href="/about" className="secondary-hero-btn">
                  Learn More
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <FadeIn delay={0.6} duration={1.0}>
          <div className="page-hero-bottom-text">
            ABGCC strengthens commercial relationships, strategic partnerships,
            and economic collaboration between the United States, the Balkans, and
            global partners.
          </div>
        </FadeIn>
      </section>

      <PartnerSection />
      <MissionSection />
      <MembershipCTA />
      <EventsPreview />
    </main>
  );
}
