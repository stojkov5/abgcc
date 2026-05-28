import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BadgeDollarSign,
  CalendarDays,
  Mail,
  Users,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import {
  AdminActionCard,
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminStatCard,
} from "@/components/admin/AdminUI";

import "../../styles/admin.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const adminCards = [
  {
    title: "Memberships",
    text: "Manage tiers, pricing, descriptions, and active status.",
    href: "/admin/memberships",
    icon: BadgeDollarSign,
  },
  {
    title: "Events",
    text: "Create, edit, publish, and manage ABGCC events.",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Contact Messages",
    text: "Review incoming contact requests and partnership messages.",
    href: "/admin/contact-messages",
    icon: Mail,
  },
  {
    title: "Users",
    text: "View members, profiles, payments, and memberships.",
    href: "/admin/users",
    icon: Users,
  },
];

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const now = new Date();

  const [
    totalUsers,
    totalEvents,
    activeMemberships,
    revenueResult,
    recentPayments,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.membership.count({
      where: {
        status: "ACTIVE",
        endDate: {
          gt: now,
        },
      },
    }),
    prisma.payment.aggregate({
      where: {
        status: "paid",
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.payment.findMany({
      take: 6,
      include: {
        user: true,
        tier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.findMany({
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalRevenue = revenueResult._sum.amount || 0;

  return (
    <AdminShell>
      <div className="admin-dashboard">
        <AdminPageHeader
          eyebrow="Admin Dashboard"
          title="Overview"
          text="Manage ABGCC members, payments, events, messages, and membership operations from one workspace."
        />

        <div className="admin-stats-grid">
          <AdminStatCard
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            text="Successful Stripe payments"
          />

          <AdminStatCard
            label="Total Users"
            value={totalUsers}
            text="Registered accounts"
          />

          <AdminStatCard
            label="Active Members"
            value={activeMemberships}
            text="Valid active memberships"
          />

          <AdminStatCard
            label="Total Events"
            value={totalEvents}
            text="Created ABGCC events"
          />
        </div>

        <div className="admin-dashboard-grid">
          <AdminPanel title="Management" className="admin-dashboard-main-panel">
            <div className="admin-management-grid">
              {adminCards.map((card) => (
                <AdminActionCard
                  key={card.title}
                  href={card.href}
                  icon={card.icon}
                  title={card.title}
                  text={card.text}
                />
              ))}
            </div>
          </AdminPanel>

          <AdminPanel
            title="Recent Payments"
            action={<Link href="/admin/payments">View All</Link>}
          >
            {recentPayments.length > 0 ? (
              <div className="admin-mini-list">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="admin-mini-item">
                    <div>
                      <strong>{payment.user?.name || payment.user?.email}</strong>
                      <span>{payment.tier?.title || "Membership"}</span>
                    </div>

                    <b>${payment.amount}</b>
                  </div>
                ))}
              </div>
            ) : (
              <AdminEmptyState text="No payments yet." />
            )}
          </AdminPanel>

          <AdminPanel
            title="Recent Users"
            action={<Link href="/admin/users">View All</Link>}
          >
            {recentUsers.length > 0 ? (
              <div className="admin-mini-list">
                {recentUsers.map((user) => (
                  <Link
                    href={`/admin/users/${user.id}`}
                    key={user.id}
                    className="admin-mini-item"
                  >
                    <div>
                      <strong>{user.name || "Unnamed User"}</strong>
                      <span>{user.email}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <AdminEmptyState text="No users yet." />
            )}
          </AdminPanel>
        </div>
      </div>
    </AdminShell>
  );
}