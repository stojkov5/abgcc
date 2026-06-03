import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BadgeDollarSign,
  CalendarDays,
  Mail,
  Users,
  Newspaper,
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
    title: "News & Blog",
    text: "Write, publish, and manage news articles and blog posts.",
    href: "/admin/posts",
    icon: Newspaper,
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
    eventRevenueResult,
    recentPayments,
    recentEventBookings,
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
    prisma.eventBooking.aggregate({
      where: {
        paid: true,
      },
      _sum: {
        amountPaid: true,
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
    prisma.eventBooking.findMany({
      where: {
        paid: true,
      },
      take: 6,
      include: {
        event: true,
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

  const membershipRevenue = revenueResult._sum.amount || 0;
  const eventRevenue = eventRevenueResult._sum.amountPaid || 0;
  const totalRevenue = membershipRevenue + eventRevenue;

  // Merge membership payments + paid event tickets into one recent list
  const combinedPayments = [
    ...recentPayments.map((payment) => ({
      id: payment.id,
      name: payment.user?.name || payment.user?.email || "Member",
      label: payment.tier?.title || "Membership",
      amount: payment.amount,
      createdAt: payment.createdAt,
    })),
    ...recentEventBookings.map((booking) => ({
      id: booking.id,
      name: booking.name,
      label: `${booking.event.title} · Event`,
      amount: booking.amountPaid,
      createdAt: booking.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

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
            {combinedPayments.length > 0 ? (
              <div className="admin-mini-list">
                {combinedPayments.map((payment) => (
                  <div key={payment.id} className="admin-mini-item">
                    <div>
                      <strong>{payment.name}</strong>
                      <span>{payment.label}</span>
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