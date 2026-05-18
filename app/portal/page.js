import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  HeroReveal,
  HeroItem,
  Reveal,
} from "@/components/MotionReveal";

import "../../styles/portal.css";

export default async function PortalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="portal-page">
      <div className="portal-container">
        <HeroReveal>
          <HeroItem as="p" className="portal-eyebrow">
            Member Portal
          </HeroItem>

          <HeroItem as="h1" className="portal-title">
            Welcome, {session.user?.name || "Member"}
          </HeroItem>

          <HeroItem as="p" className="portal-text">
            Access your membership information, ABGCC opportunities,
            international networking events, and strategic business resources.
          </HeroItem>
        </HeroReveal>

        <div className="portal-grid">
          <Reveal className="portal-card" amount={0.25}>
            <span className="portal-card-label">
              Member Information
            </span>

            <h2 className="portal-member-name">
              {session.user?.name || "ABGCC Member"}
            </h2>

            <div className="portal-info">
              <div className="portal-info-item">
                <span className="portal-info-title">Email</span>

                <span className="portal-info-value">
                  {session.user?.email}
                </span>
              </div>

              <div className="portal-info-item">
                <span className="portal-info-title">Role</span>

                <span className="portal-info-value">
                  {session.user?.role}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal className="portal-card portal-side-card" amount={0.35}>
            <div>
              <div className="portal-badge">
                Active Member
              </div>

              <h2>
                Global opportunities through strategic connections.
              </h2>

              <p>
                Your ABGCC membership provides access to international
                networking opportunities, business initiatives, investment
                discussions, and exclusive chamber events.
              </p>
            </div>

            <Link href="/events" className="portal-action">
              Explore Events <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </main>
  );
}