export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import AdminAssignMembershipForm from "@/components/AdminAssignMembershipForm";
import AdminUserMembershipControls from "@/components/AdminUserMembershipControls";

import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/MotionReveal";

import "../../../../styles/admin.css";

export default async function AdminUserDetailsPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      memberships: {
        include: {
          tier: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      eventBookings: {
        include: {
          event: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) notFound();

  const tiers = await prisma.membershipTier.findMany({
    where: {
      active: true,
    },
    orderBy: {
      price: "asc",
    },
  });

  const currentMembership = user.memberships[0];

  return (
    <main className="admin-page">
      <section className="admin-container">
        <Reveal>
          <Link href="/admin/users" className="admin-back-link">
            <ArrowLeft size={16} />
            Back to Users
          </Link>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="admin-user-profile-card">
            <div className="admin-user-profile-avatar">
              {user.photo ? (
                <Image
                  src={user.photo}
                  alt={user.name || "User"}
                  fill
                  className="admin-user-avatar-img"
                />
              ) : (
                <span>
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
                </span>
              )}
            </div>

            <div>
              <p className="admin-eyebrow">User Profile</p>

              <h1 className="admin-title">
                {user.name || "Unnamed User"}
              </h1>

              <p className="admin-text">
                {user.position || "No position added"}
                {user.organization
                  ? ` · ${user.organization}`
                  : ""}
              </p>
            </div>
          </div>
        </Reveal>

        <Stagger className="admin-user-detail-grid">
          <StaggerItem
            as="article"
            className="admin-user-detail-card"
          >
            <h2>Profile Information</h2>

            <div className="admin-user-detail-list">
              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {user.phone || "Not added"}
              </p>

              <p>
                <strong>Organization:</strong>{" "}
                {user.organization || "Not added"}
              </p>

              <p>
                <strong>Position:</strong>{" "}
                {user.position || "Not added"}
              </p>

              <p>
                <strong>Role:</strong> {user.role}
              </p>

              <p>
                <strong>Profile Completed:</strong>{" "}
                {user.profileCompleted ? "Yes" : "No"}
              </p>

              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </StaggerItem>

          <StaggerItem
            as="article"
            className="admin-user-detail-card"
          >
            <h2>Current Membership</h2>

            {currentMembership ? (
              <div className="admin-user-detail-list">
                <p>
                  <strong>Tier:</strong>{" "}
                  {currentMembership.tier.title}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {currentMembership.status}
                </p>

                <p>
                  <strong>Start Date:</strong>{" "}
                  {currentMembership.startDate
                    ? new Date(
                        currentMembership.startDate
                      ).toLocaleDateString()
                    : "Not set"}
                </p>

                <p>
                  <strong>Renewal Date:</strong>{" "}
                  {currentMembership.endDate
                    ? new Date(
                        currentMembership.endDate
                      ).toLocaleDateString()
                    : "Not set"}
                </p>

                <AdminUserMembershipControls
                  membership={currentMembership}
                />
              </div>
            ) : (
              <p className="admin-text">
                No membership found.
              </p>
            )}
          </StaggerItem>

          <StaggerItem
            as="article"
            className="admin-user-detail-card admin-user-bio-card"
          >
            <h2>Biography</h2>

            <p>{user.bio || "No biography added."}</p>
          </StaggerItem>
        </Stagger>

        <Reveal delay={0.12}>
          <div className="admin-user-detail-card admin-membership-assign-card">
            <h2>Assign Membership</h2>

            <AdminAssignMembershipForm
              userId={user.id}
              tiers={tiers}
            />
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="admin-user-detail-card admin-user-events-card">
            <h2>Membership History</h2>

            {user.memberships.length > 0 ? (
              <div className="admin-user-events-list">
                {user.memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className="admin-user-event-item"
                  >
                    <div>
                      <h3>{membership.tier.title}</h3>

                      <p>
                        {membership.startDate
                          ? new Date(
                              membership.startDate
                            ).toLocaleDateString()
                          : "No start date"}{" "}
                        —{" "}
                        {membership.endDate
                          ? new Date(
                              membership.endDate
                            ).toLocaleDateString()
                          : "No renewal date"}
                      </p>
                    </div>

                    <span className="admin-status active">
                      {membership.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-text">
                No memberships assigned yet.
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="admin-user-detail-card admin-user-events-card">
            <h2>Event Registrations</h2>

            {user.eventBookings.length > 0 ? (
              <div className="admin-user-events-list">
                {user.eventBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="admin-user-event-item"
                  >
                    <div>
                      <h3>{booking.event.title}</h3>

                      <p>
                        {new Date(
                          booking.event.startDate
                        ).toLocaleDateString()}{" "}
                        · {booking.event.location}
                      </p>
                    </div>

                    <span
                      className={`admin-status ${
                        booking.attended
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {booking.attended
                        ? "Attended"
                        : "Registered"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-text">
                No event registrations yet.
              </p>
            )}
          </div>
        </Reveal>
      </section>
    </main>
  );
}