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
import { prisma } from "@/lib/prisma";
import HeroVideo from "@/components/HeroVideo";
import ScrollCue from "@/components/ScrollCue";

import { Reveal, RevealWords, RevealLine, Stagger, StaggerItem } from "@/components/MotionReveal";
import { MEMBERSHIP_INTRO, TIERS } from "@/lib/membership/tiers";
import MembershipTiers from "@/components/MembershipTiers";
import MembershipComparison from "@/components/MembershipComparison";

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

// Match a curated tier to a real DB tier (by title alias) so checkout works.
function normalize(s) {
  return (s || "").toLowerCase().replace(/membership/g, "").trim();
}

export default async function MembershipPage() {
  const dbTiers = await prisma.membershipTier.findMany({
    where: { active: true },
  });

  const tiers = TIERS.map((t) => {
    const match = dbTiers.find((db) =>
      t.aliases.some((a) => normalize(db.title).includes(a))
    );
    return {
      key: t.key,
      title: t.title,
      premier: Boolean(t.premier),
      description: t.description,
      price: match?.price ?? t.price,
      tierId: match?.id || null,
    };
  });

  const introParas = MEMBERSHIP_INTRO.split("\n\n");

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
          </div>
        </div>

        <div className="page-hero-bottom-text">
          Join the American Balkan Global Chamber of Commerce and connect with a
          strategic network of business leaders, investors, institutions, and
          entrepreneurs.
        </div>

        <ScrollCue />
      </section>

      {/* Intro */}
      <section className="membership-intro-section" id="membership-overview">
        <div className="page-container">
          <Reveal className="membership-intro-card">
            <span className="section-label">Membership</span>
            <h2>A membership level designed to help you achieve your goals.</h2>
            <RevealLine delay={0.2} style={{ margin: "1.5rem 0" }} />
            {introParas.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Why become a member */}
      <section className="membership-value-section" id="membership-value">
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

      {/* Tiers */}
      <section className="membership-tiers-section" id="membership-tiers">
        <div className="page-container">
          <Reveal className="section-heading center">
            <span className="section-label">Membership Tiers</span>
            <h2>Find the right level for you.</h2>
          </Reveal>

          <MembershipTiers tiers={tiers} />
        </div>
      </section>

      {/* Comparison */}
      <section className="membership-comparison-section" id="membership-comparison">
        <div className="page-container">
          <Reveal className="section-heading center">
            <span className="section-label">Benefits Comparison</span>
            <h2>Compare membership benefits.</h2>
          </Reveal>

          <Reveal delay={0.08}>
            <MembershipComparison />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
