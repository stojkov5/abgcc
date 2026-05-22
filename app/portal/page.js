export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight, Edit3 } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { HeroReveal, HeroItem, Reveal } from "@/components/MotionReveal";

import "../../styles/portal.css";

export default async function PortalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      memberships: {
        include: {
          tier: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const currentMembership = user.memberships[0];

  return (
    <main className="portal-page">
      <div className="portal-container">
        <HeroReveal>
          <HeroItem as="p" className="portal-eyebrow">
            Member Portal
          </HeroItem>

          <HeroItem as="h1" className="portal-title">
            Welcome, {user.name || "Member"}
          </HeroItem>

          <HeroItem as="p" className="portal-text">
            Manage your ABGCC profile, membership status, opportunities, events,
            and future renewals from your private member portal.
          </HeroItem>
        </HeroReveal>

        <div className="portal-profile-hero">
          <div className="portal-avatar">
            {user.photo ? (
              <Image
                src={user.photo}
                alt={user.name || "Member"}
                fill
                className="portal-avatar-img"
              />
            ) : (
              <span>{user.name ? user.name.charAt(0).toUpperCase() : "M"}</span>
            )}
          </div>

          <div className="portal-profile-main">
            <span className="portal-card-label">Member Profile</span>

            <h2>{user.name || "ABGCC Member"}</h2>

            <p>
              {user.position || "Position not added"}
              {user.organization ? ` · ${user.organization}` : ""}
            </p>

            {user.bio && <div className="portal-bio">{user.bio}</div>}
          </div>

          <Link href="/portal/profile" className="portal-edit-btn">
            <Edit3 size={16} />
            Edit Profile
          </Link>
        </div>

        <div className="portal-grid">
          <Reveal className="portal-card" amount={0.25}>
            <span className="portal-card-label">Member Information</span>

            <div className="portal-info">
              <div className="portal-info-item">
                <span className="portal-info-title">Email</span>
                <span className="portal-info-value">{user.email}</span>
              </div>

              <div className="portal-info-item">
                <span className="portal-info-title">Organization</span>
                <span className="portal-info-value">
                  {user.organization || "Not added"}
                </span>
              </div>

              <div className="portal-info-item">
                <span className="portal-info-title">Position</span>
                <span className="portal-info-value">
                  {user.position || "Not added"}
                </span>
              </div>

              <div className="portal-info-item">
                <span className="portal-info-title">Phone</span>
                <span className="portal-info-value">
                  {user.phone || "Not added"}
                </span>
              </div>

              <div className="portal-info-item">
                <span className="portal-info-title">Role</span>
                <span className="portal-info-value">{user.role}</span>
              </div>
            </div>
          </Reveal>

          <Reveal className="portal-card portal-side-card" amount={0.35}>
            <div>
              <div className="portal-badge">
                {currentMembership?.status || "No Active Membership"}
              </div>

              <h2>
                {currentMembership
                  ? currentMembership.tier.title
                  : "Choose your ABGCC membership."}
              </h2>

              {currentMembership ? (
                <div className="portal-info">
                  <div className="portal-info-item">
                    <span className="portal-info-title">Membership Level</span>
                    <span className="portal-info-value">
                      {currentMembership.tier.title}
                    </span>
                  </div>

                  <div className="portal-info-item">
                    <span className="portal-info-title">Status</span>
                    <span className="portal-info-value">
                      {currentMembership.status}
                    </span>
                  </div>

                  <div className="portal-info-item">
                    <span className="portal-info-title">Renewal Date</span>
                    <span className="portal-info-value">
                      {currentMembership.endDate
                        ? new Date(currentMembership.endDate).toLocaleDateString()
                        : "Not set"}
                    </span>
                  </div>
                </div>
              ) : (
                <p>
                  Your ABGCC membership provides access to international
                  networking opportunities, investment discussions, and exclusive
                  chamber events.
                </p>
              )}
            </div>

            <Link
              href={currentMembership ? "/events" : "/membership"}
              className="portal-action"
            >
              {currentMembership ? "Explore Events" : "View Memberships"}{" "}
              <ArrowRight size={16} />
            </Link>
          </Reveal>

          <Reveal className="portal-card portal-payment-card" amount={0.35}>
            <span className="portal-card-label">Payment History</span>

            <h2>Membership payments</h2>

            <p>
              Payment history will appear here after Stripe membership checkout
              is connected.
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}