// Membership tiers rarely change — cache for 1 hour
export const revalidate = 3600;

export const metadata = {
  title: "Membership",
  description:
    "Join ABGCC and access a strategic network of business leaders, investors, institutions, and entrepreneurs across the US, the Balkans, and global markets.",
  alternates: { canonical: "/membership" },
  openGraph: {
    title: "Membership | ABGCC",
    description:
      "Choose your ABGCC membership tier and gain priority access to our network, programs, events, and one-on-one support.",
    url: "/membership",
  },
};

import "@/styles/membership.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HeroVideo from "@/components/HeroVideo";
import MembershipCheckoutButton from "../../../components/MembershipCheckoutButton";

import { Reveal, RevealWords, RevealLine, Stagger, StaggerItem } from "@/components/MotionReveal";

import AnimatedPrice from "../../../components/AnimatedPrice";
const membershipValues = [
  {
    title: "Stronger network, better opportunities",
    text: "As a member, you join a high-trust community of business leaders, investors, and experts who share a serious interest in the Balkans and its links to global markets, making it easier to find credible partners and reliable information.",
  },
  {
    title: "Visibility and credibility",
    text: "Members can be featured on our website, in our directories, and across our communication channels, signaling to clients and partners that they are part of a respected chamber committed to professional standards and cross-border collaboration.",
  },
  {
    title: "Access to events and insights",
    text: "Depending on your tier, you receive invitations and priority access to networking events, trade missions, workshops, and premium receptions, often alongside major international forums such as the UN General Assembly or regional summits.",
  },
  {
    title: "Targeted support for your goals",
    text: "We work with members to understand their objectives — market expansion, sourcing, investment, or visibility — and then align introductions, event invitations, and advisory time to help them achieve measurable progress.",
  },
];

export default async function MembershipPage() {
  const tiers = await prisma.membershipTier.findMany({
    where: {
      active: true,
    },
    orderBy: {
      price: "asc",
    },
  });

  return (
    <main className="membership-page">
      <section className="page-hero">
        <HeroVideo video="/Memberships.mp4" poster="/MembershipsPoster.webp" />

        <div className="page-hero-shell">
          <div className="page-hero-content">
            <Reveal delay={0.05}>
              <p className="page-hero-eyebrow">Membership</p>
            </Reveal>

            <Reveal delay={0.12}>
              <h1 className="page-hero-title">
                <RevealWords delay={0.16} wordDelay={0.08}>
                  Choose your membership
                </RevealWords>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex justify-center">
                <Link href="#membership-tiers" className="primary-hero-btn">
                  View Tiers <ArrowRight size={17} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="page-hero-bottom-text">
          Join the American Balkan Global Chamber of Commerce and connect with a
          strategic network of business leaders, investors, institutions, and
          entrepreneurs.
        </div>
      </section>

      <section className="membership-intro-section">
        <div className="page-container">
          <Reveal className="membership-intro-card">
            <span className="section-label">Membership</span>

            <h2>A structured membership system built for serious growth.</h2>

            <RevealLine delay={0.2} style={{ margin: "1.5rem 0" }} />

            <p>
            We offer a structured membership system designed for individuals, small 
businesses, corporations, and patrons to benefit from priority access to our 
network, programs, and support
            </p>
          </Reveal>
        </div>
      </section>

      <section className="membership-value-section">
        <div className="page-container">
          <Reveal className="section-heading center">
            <span className="section-label">Membership Value</span>
            <h2>Why become a member?</h2>
          </Reveal>

          <Stagger className="membership-value-grid">
            {membershipValues.map((item, index) => (
              <StaggerItem
                as="article"
                className="membership-value-card"
                key={item.title}
              >
                <span className="membership-card-number">0{index + 1}</span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="membership-tiers-section" id="membership-tiers">
        <div className="page-container">
          <Reveal className="section-heading">
            <span className="section-label">Membership Tiers</span>

      
          </Reveal>

          <Stagger className="membership-tiers-grid">
            {tiers.map((tier) => (
              <StaggerItem
                as="article"
                key={tier.id}
                className="membership-tier-card"
              >
                <div>
                  <h3>{tier.title}</h3>

                  <p className="membership-price">
                  <AnimatedPrice value={tier.price} />
                  </p>

                  <p className="membership-period">{tier.period}</p>
                </div>

                <p className="membership-description">{tier.description}</p>

                <MembershipCheckoutButton tierId={tier.id} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </main>
  );
}