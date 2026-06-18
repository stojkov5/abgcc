export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";

import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminStatus,
} from "@/components/admin/AdminUI";

import "@/styles/admin-users.css";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const now = new Date();

  const users = await prisma.user.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AdminShell>
      <div className="admin-users-page">
        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Users"
          text="View registered members, profile information, membership status, and account details."
        />

        <AdminPanel title={`All Users (${users.length})`}>
          {users.length > 0 ? (
            <div className="admin-users-list">
              {users.map((user) => {
                const currentMembership = user.memberships.find(
                  (membership) =>
                    membership.endDate && new Date(membership.endDate) > now
                );

                const displayedStatus = currentMembership
                  ? currentMembership.status
                  : "No Membership";

                return (
                  <Link
                    key={user.id}
                    href={`/admin/users/${user.id}`}
                    className="admin-user-card"
                  >
                    <div className="admin-user-avatar">
                      {user.photo ? (
                        <Image
                          src={user.photo}
                          alt={user.name || "User"}
                          fill
                          sizes="84px"
                          className="admin-user-avatar-img"
                        />
                      ) : (
                        <span>
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>

                    <div className="admin-user-main">
                      <div className="admin-user-top">
                        <div>
                          <h2>{user.name || "Unnamed User"}</h2>
                          <p>{user.organization || "No organization added"}</p>
                        </div>

                        <AdminStatus
                          variant={currentMembership ? "active" : "inactive"}
                        >
                          {displayedStatus}
                        </AdminStatus>
                      </div>

                      <div className="admin-user-meta">
                        <span>{user.email}</span>
                        {user.memberNumber && (
                          <span>Member #{user.memberNumber}</span>
                        )}
                        <span>
                          {currentMembership?.tier?.title || "No tier"}
                        </span>
                      </div>

                      <div className="admin-user-bottom">
                        <span className="admin-user-link">
                          View Profile <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <AdminEmptyState text="No users found." />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}