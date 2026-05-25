import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/MotionReveal";

import "../../styles/EventSection.css";

export default function EventsPreview() {
  return (
    <section className="landing-section events-preview">
      <video
        className="events-preview-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/LandingEvents.mp4" type="video/mp4" />
      </video>

      <div className="events-preview-overlay" />

      <div className="landing-container events-preview-inner">
        <Reveal className="section-heading center compact">
          <span className="section-label">Events</span>

          <h2>Empowering Connections</h2>

          <h3>Showcasing opportunities between the Balkans and the world</h3>

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