export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { ArrowRight, Edit3, ShieldCheck } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { Reveal, Stagger, StaggerItem } from "@/components/MotionReveal";

import "@/styles/portal.css";

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

    payments: {
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

 const currentMembership = user.memberships.find((membership) => {
  if (!membership.endDate) return false;

  return new Date(membership.endDate) > new Date();
});

const membershipIsExpired =
  currentMembership?.endDate &&
  new Date(currentMembership.endDate) < new Date();

const displayedMembershipStatus = currentMembership
  ? membershipIsExpired
    ? "EXPIRED"
    : currentMembership.status
  : "No Active Membership";

  return (
    <main className="portal-page">
      <div className="portal-container">
        {!user.emailVerified && (
          <div style={{
            background: "#fef3cd",
            border: "1px solid #f59e0b",
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 24,
            fontSize: 14,
            color: "#92400e",
            lineHeight: 1.6,
          }}>
            <strong>Verify your email.</strong> Check your inbox for a verification link.
            Some features (events, membership, contact) require a verified email.
          </div>
        )}

        <Reveal>
          <p className="portal-eyebrow">Member Portal</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="portal-title">
            Welcome, {user.name || "Member"}
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="portal-text">
            Manage your ABGCC profile, membership status, opportunities, events,
            and future renewals from your private member portal.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
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
                <span>
                  {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                </span>
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

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/portal/profile" className="portal-edit-btn">
                <Edit3 size={16} />
                Edit Profile
              </Link>

              <Link href="/portal/security" className="portal-edit-btn">
                <ShieldCheck size={16} />
                Security
              </Link>
            </div>
          </div>
        </Reveal>

        <Stagger className="portal-grid">
          <StaggerItem className="portal-card">
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
          </StaggerItem>

          <StaggerItem className="portal-card portal-side-card">
            <div>
              <div className="portal-badge">
                {displayedMembershipStatus}
              </div>

              <h2>
                {currentMembership
                  ? currentMembership.tier.title
                  : "Choose your ABGCC membership."}
              </h2>

              {currentMembership ? (
                <div className="portal-info">
                  <div className="portal-info-item">
                    <span className="portal-info-title">
                      Membership Level
                    </span>

                    <span className="portal-info-value">
                      {currentMembership.tier.title}
                    </span>
                  </div>

                  <div className="portal-info-item">
                    <span className="portal-info-title">Status</span>

                    <span className="portal-info-value">
                      {displayedMembershipStatus}
                    </span>
                  </div>

                  <div className="portal-info-item">
                    <span className="portal-info-title">Renewal Date</span>

                    <span className="portal-info-value">
                      {currentMembership.endDate
                        ? new Date(
                            currentMembership.endDate
                          ).toLocaleDateString()
                        : "Not set"}
                    </span>
                  </div>
                </div>
              ) : (
                <p>
                  Your ABGCC membership provides access to international
                  networking opportunities, investment discussions, and
                  exclusive chamber events.
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
          </StaggerItem>

         <StaggerItem className="portal-card portal-payment-card">
  <span className="portal-card-label">Payment History</span>

  <h2>Membership payments</h2>

  {user.payments.length > 0 ? (
    <div className="portal-payments">
      {user.payments.map((payment) => (
        <div
          key={payment.id}
          className="portal-payment-item"
        >
          <div>
            <span className="portal-payment-tier">
              {payment.tier?.title || "Membership"}
            </span>

            <span className="portal-payment-date">
              {new Date(payment.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="portal-payment-right">
            <span className="portal-payment-amount">
              ${payment.amount}
            </span>

            <span
              className={`portal-payment-status ${
                payment.status === "paid"
                  ? "paid"
                  : "pending"
              }`}
            >
              {payment.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>
      No payment history available yet.
    </p>
  )}
</StaggerItem>
        </Stagger>
      </div>
    </main>
  );
}