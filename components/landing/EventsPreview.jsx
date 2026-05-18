import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/MotionReveal";

export default function EventsPreview() {
  return (
    <section className="landing-section events-preview">
      <div className="landing-container">
        <Reveal className="section-heading center compact" amount={0.4}>
          <span className="section-label">Events</span>

          <h2>Empowering Connections</h2>

          <h3>
            Showcasing opportunities between the Balkans and the world
          </h3>

          <p>
            From high-profile receptions during global gatherings to focused
            industry roundtables, our events bring together business leaders,
            policymakers, investors, and innovators.
          </p>

          <Link href="/events" className="landing-outline-btn">
            View All Events <ArrowRight size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}