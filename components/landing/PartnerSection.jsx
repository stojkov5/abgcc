import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/MotionReveal";

const partnerCards = [
  {
    title: "Invest Connect",
    text: "We facilitate trade and investment opportunities by connecting businesses, investors, and key stakeholders across the U.S., the Balkans, and strategic global markets.",
  },
  {
    title: "Market Entry",
    text: "We assist companies in understanding and developing business relationships between the Balkans, North America, and global markets through trusted guidance and introductions.",
  },
  {
    title: "Growth Network",
    text: "We support Balkan and American entrepreneurs and professionals through mentorship, peer networks, sector communities, and access to growth resources.",
  },
  {
    title: "Business Bridge",
    text: "We serve as a vital link between regions by designing initiatives, programs, and events that bring together business leaders, policymakers, and cultural representatives.",
  },
];

export default function PartnerSection() {
  return (
    <section className="landing-section partner-section">
      <div className="landing-container">
        <Reveal className="section-heading center" amount={0.35}>
          <span className="section-label">What We Do</span>

          <h2>
            Your partner in growing{" "}
            <span>US-Balkan</span> global relations.
          </h2>

          <p>
            Our organization is dedicated to fostering economic growth, cultural
            exchange, and business partnerships between the United States, the
            Balkans, and globally.
          </p>
        </Reveal>

        <Stagger className="partner-grid">
          {partnerCards.map((card, index) => (
            <StaggerItem
              as="article"
              key={card.title}
              className="partner-card"
            >
              <span className="card-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}