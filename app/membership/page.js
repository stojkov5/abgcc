export const dynamic = "force-dynamic";
export const revalidate = 0;

import "../../styles/membership.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

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
      <section className="membership-hero">
        <Image
          src="/Membership.webp"
          alt="ABGCC Membership"
          fill
          priority
          className="membership-hero-img"
        />

        <div className="membership-hero-overlay" />

        <div className="page-hero-shell">
  <div className="membership-hero-content page-hero-content">
            <p className="membership-eyebrow">Membership</p>

            <h1 className="membership-title">Choose your membership.</h1>

            <p className="membership-hero-text mx-auto">
              Join the American Balkan Global Chamber of Commerce and connect
              with a strategic network of business leaders, investors,
              institutions, and entrepreneurs.
            </p>

            <Link href="#membership-tiers" className="membership-hero-btn">
              View Tiers <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="membership-intro-section">
        <div className="membership-container">
          <div className="membership-intro-card">
            <span className="section-label">Membership</span>

            <h2>A structured membership system built for serious growth.</h2>

            <p>
              We offer a structured membership system designed for individuals,
              professionals, businesses, corporations, and executive partners who
              want priority access to our network, programs, and support.
            </p>
          </div>
        </div>
      </section>

      <section className="membership-value-section">
        <div className="membership-container">
          <div className="section-heading center">
            <span className="section-label">Membership Value</span>
            <h2>Why become a member?</h2>
          </div>

          <div className="membership-value-grid">
            {membershipValues.map((item, index) => (
              <article className="membership-value-card" key={item.title}>
                <span className="membership-card-number">
                  0{index + 1}
                </span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="membership-tiers-section" id="membership-tiers">
        <div className="membership-container">
          <div className="section-heading">
            <span className="section-label">Membership Tiers</span>
            <h2>Select the level that fits your goals.</h2>
          </div>

          <div className="membership-tiers-grid">
            {tiers.map((tier) => (
              <article key={tier.id} className="membership-tier-card">
                <div>
                  <h3>{tier.title}</h3>

                  <p className="membership-price">
                    ${tier.price.toLocaleString()}
                  </p>

                  <p className="membership-period">{tier.period}</p>
                </div>

                <p className="membership-description">{tier.description}</p>

                <Link href="/contact" className="membership-tier-btn">
                  Contact Us
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}