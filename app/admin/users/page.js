export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/MotionReveal";

import "../../../styles/admin.css";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

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
    <main className="admin-page">
      <section className="admin-container">
        <div className="admin-topbar">
          <div>
            <Reveal>
              <p className="admin-eyebrow">Admin Panel</p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="admin-title">Users</h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="admin-text">
                View registered members, profile information, membership
                status, and account details.
              </p>
            </Reveal>
          </div>
        </div>

        <Stagger className="admin-users-grid">
          {users.map((user) => {
            const currentMembership = user.memberships[0];

            return (
              <StaggerItem
                key={user.id}
                as="article"
              >
                <Link
                  href={`/admin/users/${user.id}`}
                  className="admin-user-card"
                >
                  <div className="admin-user-avatar">
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

                  <div className="admin-user-main">
                    <h2>{user.name || "Unnamed User"}</h2>

                    <p>
                      {user.organization || "No organization added"}
                    </p>

                    <div className="admin-user-meta">
                      <span>{user.email}</span>

                      <span>{user.phone || "No phone"}</span>
                    </div>

                    <div className="admin-user-bottom">
                      <span className="admin-status active">
                        {currentMembership?.status || "No Membership"}
                      </span>

                      <span className="admin-table-link">
                        View Profile <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>
    </main>
  );
}