export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { ArrowRight, Edit3, ShieldCheck, AlertTriangle, Landmark } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { Reveal, Stagger, StaggerItem } from "@/components/MotionReveal";

import "@/styles/portal.css";

export default async function PortalPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: { include: { tier: true }, orderBy: { createdAt: "desc" } },
      payments: { include: { tier: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) redirect("/login");

  const currentMembership = user.memberships.find(
    (m) => m.endDate && new Date(m.endDate) > new Date()
  );

  const pendingBankTransfer = user.memberships.find(
    (m) =>
      m.status === "PENDING" &&
      m.paymentMethod === "BANK_TRANSFER" &&
      m.invoiceReference
  );

  const membershipIsExpired =
    currentMembership?.endDate && new Date(currentMembership.endDate) < new Date();

  const displayedMembershipStatus = currentMembership
    ? membershipIsExpired
      ? "EXPIRED"
      : currentMembership.status
    : "Guest";

  const memberSince = new Date(user.createdAt).getFullYear();
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "M";

  return (
    <main className="portal-page">
      {/* Ambient backdrop accents */}
      <div className="portal-ambient" aria-hidden="true" />

      <div className="portal-container">
        {/* Notices */}
        {!user.emailVerified && (
          <div className="portal-notice portal-notice--warn">
            <AlertTriangle size={18} />
            <span>
              <strong>Verify your email.</strong> Check your inbox for a
              verification link. Some features require a verified email.
            </span>
          </div>
        )}

        {pendingBankTransfer && (
          <Link
            href={`/portal/invoice/${pendingBankTransfer.invoiceReference}`}
            className="portal-notice portal-notice--info"
          >
            <Landmark size={18} />
            <span>
              <strong>Bank transfer pending.</strong> View your invoice with the
              bank details and reference.
            </span>
            <ArrowRight size={16} className="portal-notice-arrow" />
          </Link>
        )}

        {/* Header */}
        <header className="portal-header">
          <Reveal>
            <p className="portal-eyebrow">Member Portal</p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="portal-title">Welcome, {user.name || "Member"}</h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="portal-text">
              Your private space to manage your profile, membership, and access to
              the ABGCC network.
            </p>
          </Reveal>
        </header>

        {/* Hero — membership card + profile aside */}
        <Reveal delay={0.22}>
          <section className="portal-hero">
            {/* The membership card */}
            <div className={`portal-membercard ${membershipIsExpired ? "is-expired" : ""}`}>
              <div className="portal-membercard-sheen" aria-hidden="true" />
              <div className="portal-membercard-grain" aria-hidden="true" />

              <div className="portal-membercard-top">
                <div className="portal-membercard-brand">
                  <span className="portal-membercard-mark">A</span>
                  <div>
                    <strong>ABGCC</strong>
                    <small>Member Card</small>
                  </div>
                </div>

                <span className="portal-membercard-tag">
                  {displayedMembershipStatus}
                </span>
              </div>

              <div className="portal-membercard-chip" aria-hidden="true" />

              <div className="portal-membercard-body">
                <span className="portal-membercard-label">Card Holder</span>
                <h2 className="portal-membercard-name">
                  {user.name || "ABGCC Member"}
                </h2>
                {user.memberNumber && (
                  <p className="portal-membercard-number">
                    Member No. {user.memberNumber}
                  </p>
                )}
              </div>

              <div className="portal-membercard-bottom">
                <div>
                  <span className="portal-membercard-label">Tier</span>
                  <strong>
                    {currentMembership ? currentMembership.tier.title : "Guest Access"}
                  </strong>
                </div>

                <div className="portal-membercard-since">
                  <span className="portal-membercard-label">Member Since</span>
                  <strong>{memberSince}</strong>
                </div>
              </div>
            </div>

            {/* Profile aside */}
            <aside className="portal-aside">
              <div className="portal-aside-avatar">
                {user.photo ? (
                  <Image
                    src={user.photo}
                    alt={user.name || "Member"}
                    fill
                    sizes="120px"
                    className="portal-avatar-img"
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>

              <h3 className="portal-aside-name">{user.name || "ABGCC Member"}</h3>
              <p className="portal-aside-role">
                {user.position || "Position not added"}
                {user.organization ? ` · ${user.organization}` : ""}
              </p>

              {user.bio && <p className="portal-aside-bio">{user.bio}</p>}

              <div className="portal-aside-actions">
                <Link href="/portal/profile" className="portal-btn">
                  <Edit3 size={15} />
                  Edit Profile
                </Link>
                <Link href="/portal/security" className="portal-btn portal-btn--ghost">
                  <ShieldCheck size={15} />
                  Security
                </Link>
              </div>
            </aside>
          </section>
        </Reveal>

        {/* Details */}
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
                <span className="portal-info-value">{user.organization || "Not added"}</span>
              </div>
              <div className="portal-info-item">
                <span className="portal-info-title">Position</span>
                <span className="portal-info-value">{user.position || "Not added"}</span>
              </div>
              <div className="portal-info-item">
                <span className="portal-info-title">Phone</span>
                <span className="portal-info-value">{user.phone || "Not added"}</span>
              </div>
              <div className="portal-info-item">
                <span className="portal-info-title">Role</span>
                <span className="portal-info-value">{user.role}</span>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem className="portal-card portal-side-card">
            <div>
              <div className={`portal-badge ${membershipIsExpired ? "expired" : ""}`}>
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
                    <span className="portal-info-title">Membership Level</span>
                    <span className="portal-info-value">{currentMembership.tier.title}</span>
                  </div>
                  <div className="portal-info-item">
                    <span className="portal-info-title">Status</span>
                    <span className="portal-info-value">{displayedMembershipStatus}</span>
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
                  Your ABGCC membership unlocks international networking,
                  investment discussions, and exclusive chamber events.
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
            <h2>Membership &amp; Event Payments</h2>

            {user.payments.length > 0 ? (
              <div className="portal-payments">
                {user.payments.map((payment) => (
                  <div key={payment.id} className="portal-payment-item">
                    <div>
                      <span className="portal-payment-tier">
                        {payment.tier?.title || "Membership"}
                      </span>
                      <span className="portal-payment-date">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="portal-payment-right">
                      <span className="portal-payment-amount">${payment.amount}</span>
                      <span
                        className={`portal-payment-status ${
                          payment.status === "paid" ? "paid" : "pending"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="portal-empty-text">No payment history available yet.</p>
            )}
          </StaggerItem>
        </Stagger>
      </div>
    </main>
  );
}
