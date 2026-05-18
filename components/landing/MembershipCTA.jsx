import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MembershipCTA() {
  return (
    <section className="membership-cta">
      <div className="membership-bg" />

      <div className="landing-container">
        <div className="membership-card">
          <div>
            <span className="section-label">Membership</span>

            <h2>
              Are you ready to become a part of our membership network?
            </h2>
          </div>

          <Link href="/membership" className="membership-btn">
            Become a Member <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}