import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PartnerSection from "../components/landing/PartnerSection";
import MissionSection from "../components/landing/MissionSection";
import EventsPreview from "../components/landing/EventsPreview";
import MembershipCTA from "../components/landing/MembershipCTA";
import "../styles/home.css";

import {
  HeroReveal,
  HeroItem,
  HeroImageZoom,
} from "@/components/MotionReveal";

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        
          <Image
            src="/Landing.webp"
            alt="American Balkan Global Chamber of Commerce"
            fill
            priority
            className="home-hero-img"
          />
        

        <div className="home-overlay" />

        <div className="page-hero-shell">
          <HeroReveal className="home-content page-hero-content">
            <HeroItem as="p" className="home-eyebrow">
              American Balkan Global Chamber of Commerce
            </HeroItem>

            <HeroItem as="h1" className="home-title">
              Connecting Balkan and
              <br />
              American business.
            </HeroItem>

            <HeroItem as="p" className="home-text mx-auto">
              ABGCC strengthens commercial relationships, strategic
              partnerships, and economic collaboration between the United States,
              the Balkans, and global partners.
            </HeroItem>

            <HeroItem>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/membership"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c8a76a] px-7 py-3 text-sm font-bold text-[#07111f] transition hover:-translate-y-0.5 hover:bg-[#e0bf80] sm:w-auto"
                >
                  Become a Member <ArrowRight size={17} />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15 sm:w-auto"
                >
                  Learn More
                </Link>
              </div>
            </HeroItem>
          </HeroReveal>
        </div>
      </section>

      <PartnerSection />
      <MissionSection />
      <EventsPreview />
      <MembershipCTA />
    </main>
  );
}