export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import AdminShell from "@/components/AdminShell";
import AdminAssignMembershipForm from "@/components/AdminAssignMembershipForm";
import AdminUserMembershipControls from "@/components/AdminUserMembershipControls";

import {
  AdminEmptyState,
  AdminPanel,
  AdminStatus,
} from "@/components/admin/AdminUI";

import "@/styles/admin-users.css";

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
      payments: {
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
    <AdminShell>
      <div className="admin-user-detail-page">
        <Link href="/admin/users" className="admin-user-back-link">
          <ArrowLeft size={16} />
          Back to Users
        </Link>

        <section className="admin-user-profile-card">
          <div className="admin-user-profile-avatar">
            {user.photo ? (
              <Image
                src={user.photo}
                alt={user.name || "User"}
                fill
                sizes="118px"
                className="admin-user-avatar-img"
              />
            ) : (
              <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
            )}
          </div>

          <div>
            <p className="admin-user-detail-eyebrow">User Profile</p>

            <h1>{user.name || "Unnamed User"}</h1>

            <p>
              {user.position || "No position added"}
              {user.organization ? ` · ${user.organization}` : ""}
            </p>
          </div>
        </section>

        <div className="admin-user-detail-grid">
          <AdminPanel title="Profile Information">
            <div className="admin-user-detail-list">
              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Phone:</strong> {user.phone || "Not added"}
              </p>

              <p>
                <strong>Organization:</strong>{" "}
                {user.organization || "Not added"}
              </p>

              <p>
                <strong>Position:</strong> {user.position || "Not added"}
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
          </AdminPanel>

          <AdminPanel title="Current Membership">
            {currentMembership ? (
              <div className="admin-user-detail-list">
                <p>
                  <strong>Tier:</strong> {currentMembership.tier.title}
                </p>

                <p>
                  <strong>Status:</strong> {currentMembership.status}
                </p>

                <p>
                  <strong>Start Date:</strong>{" "}
                  {currentMembership.startDate
                    ? new Date(currentMembership.startDate).toLocaleDateString()
                    : "Not set"}
                </p>

                <p>
                  <strong>Renewal Date:</strong>{" "}
                  {currentMembership.endDate
                    ? new Date(currentMembership.endDate).toLocaleDateString()
                    : "Not set"}
                </p>

                <AdminUserMembershipControls membership={currentMembership} />
              </div>
            ) : (
              <AdminEmptyState text="No membership found." />
            )}
          </AdminPanel>

          <AdminPanel title="Biography" className="admin-user-detail-wide">
            <p className="admin-user-bio-text">
              {user.bio || "No biography added."}
            </p>
          </AdminPanel>
        </div>

        <AdminPanel title="Assign Membership">
          <AdminAssignMembershipForm userId={user.id} tiers={tiers} />
        </AdminPanel>

        <AdminPanel title="Membership History">
          {user.memberships.length > 0 ? (
            <div className="admin-user-history-list">
              {user.memberships.map((membership) => (
                <div key={membership.id} className="admin-user-history-item">
                  <div>
                    <h3>{membership.tier.title}</h3>

                    <p>
                      {membership.startDate
                        ? new Date(membership.startDate).toLocaleDateString()
                        : "No start date"}{" "}
                      —{" "}
                      {membership.endDate
                        ? new Date(membership.endDate).toLocaleDateString()
                        : "No renewal date"}
                    </p>
                  </div>

                  <AdminStatus variant="active">{membership.status}</AdminStatus>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState text="No memberships assigned yet." />
          )}
        </AdminPanel>

        <AdminPanel title="Payment History">
          {user.payments.length > 0 ? (
            <div className="admin-user-history-list">
              {user.payments.map((payment) => (
                <div key={payment.id} className="admin-user-history-item">
                  <div>
                    <h3>{payment.tier?.title || "Membership Payment"}</h3>

                    <p>
                      {new Date(payment.createdAt).toLocaleDateString()} ·{" "}
                      {payment.currency.toUpperCase()}
                    </p>
                  </div>

                  <div className="admin-user-payment-meta">
                    <strong>${payment.amount}</strong>

                    <AdminStatus
                      variant={payment.status === "paid" ? "active" : "inactive"}
                    >
                      {payment.status}
                    </AdminStatus>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState text="No payments found." />
          )}
        </AdminPanel>

        <AdminPanel title="Event Registrations">
          {user.eventBookings.length > 0 ? (
            <div className="admin-user-history-list">
              {user.eventBookings.map((booking) => (
                <div key={booking.id} className="admin-user-history-item">
                  <div>
                    <h3>{booking.event.title}</h3>

                    <p>
                      {new Date(booking.event.startDate).toLocaleDateString()} ·{" "}
                      {booking.event.location}
                    </p>
                  </div>

                  <AdminStatus variant={booking.attended ? "active" : "warning"}>
                    {booking.attended ? "Attended" : "Registered"}
                  </AdminStatus>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState text="No event registrations yet." />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}