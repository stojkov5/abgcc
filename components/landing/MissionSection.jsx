import {
  Reveal,
  RevealLine,
  Stagger,
  StaggerItem,
} from "@/components/MotionReveal";

const missionCards = [
  {
    title: "Network",
    text: "Actively connect and engage with members from diverse industries, backgrounds, and geographies, promoting transformation, inclusion, and genuine representation.",
  },
  {
    title: "Build It",
    text: "Unlock business opportunities between the Balkans, North America, and global hubs by showcasing the region's potential, innovation, and strategic location.",
  },
  {
    title: "Collaborate",
    text: "Work with U.S. and international companies already active in the Balkans and with local firms ready for cross-border expansion and strategic partnerships.",
  },
  {
    title: "Promote",
    text: "Highlight the rich cultural traditions and contemporary creativity of the Balkans while strengthening trade, investment, tourism, and people-to-people ties.",
  },
];

export default function MissionSection() {
  return (
    <section className="mission-section">
      <div className="mission-overlay" />

      <div className="landing-container mission-layout">
        <Reveal className="mission-main-card" delay={0.05}>
          <span className="section-label">Our Mission</span>

          <h2>Sustainable Economic Growth and Prosperity</h2>

          <RevealLine delay={0.3} style={{ margin: "1.5rem 0" }} />

          <p>
            We strive to create a conducive business environment that fosters
            growth and development for Balkan and international businesses,
            focusing on long-term value creation rather than short-term
            transactions.
          </p>
        </Reveal>

        <Stagger className="mission-grid h-full">
          {missionCards.map((card) => (
            <StaggerItem
              as="article"
              key={card.title}
              className="mission-card"
            >
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
