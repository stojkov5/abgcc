import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/MotionReveal";

export default function MembershipCTA() {
  return (
    <section className="membership-cta">
      <div className="membership-bg" />

      <div className="landing-container">
        <Reveal className="membership-card" amount={0.35}>
          <div>
            <span className="section-label">Membership</span>

            <h2>
              Are you ready to become a part of our membership network?
            </h2>
          </div>

          <Link href="/membership" className="membership-btn">
            Become a Member <ArrowRight size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}