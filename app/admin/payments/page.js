export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import {
  AdminPageHeader,
  AdminPanel,
  AdminStatCard,
  AdminEmptyState,
  AdminStatus,
} from "@/components/admin/AdminUI";

import "@/styles/admin.css";
import "@/styles/admin-payments.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const [membershipPayments, eventBookings] = await Promise.all([
    prisma.payment.findMany({
      include: { user: true, tier: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventBooking.findMany({
      where: { paid: true },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Unified payment rows
  const rows = [
    ...membershipPayments.map((p) => ({
      id: `m-${p.id}`,
      type: "Membership",
      name: p.user?.name || "—",
      email: p.user?.email || "—",
      item: p.tier?.title || "Membership",
      amount: p.amount,
      reference: p.stripeSessionId?.slice(-10).toUpperCase() || "—",
      createdAt: p.createdAt,
    })),
    ...eventBookings.map((b) => ({
      id: `e-${b.id}`,
      type: "Event",
      name: b.name,
      email: b.email,
      item: b.event.title,
      amount: b.amountPaid,
      reference: b.reference || "—",
      createdAt: b.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const membershipRevenue = membershipPayments.reduce((sum, p) => sum + p.amount, 0);
  const eventRevenue = eventBookings.reduce((sum, b) => sum + b.amountPaid, 0);
  const totalRevenue = membershipRevenue + eventRevenue;

  return (
    <AdminShell>
      <div className="admin-payments-page">
        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Payments"
          text="All successful payments across memberships and event tickets, in one place."
        />

        <div className="admin-stats-grid">
          <AdminStatCard
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            text={`${rows.length} transaction${rows.length === 1 ? "" : "s"}`}
          />
          <AdminStatCard
            label="Membership Revenue"
            value={`$${membershipRevenue.toLocaleString()}`}
            text={`${membershipPayments.length} membership payment${membershipPayments.length === 1 ? "" : "s"}`}
          />
          <AdminStatCard
            label="Event Revenue"
            value={`$${eventRevenue.toLocaleString()}`}
            text={`${eventBookings.length} ticket${eventBookings.length === 1 ? "" : "s"} sold`}
          />
        </div>

        <AdminPanel title={`All Transactions (${rows.length})`}>
          {rows.length > 0 ? (
            <div className="admin-payments-table-wrap">
              <table className="admin-payments-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Item</th>
                    <th>Reference</th>
                    <th className="ta-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="nowrap">{formatDate(row.createdAt)}</td>
                      <td className="strong">{row.name}</td>
                      <td className="muted">{row.email}</td>
                      <td>
                        <AdminStatus variant={row.type === "Event" ? "warning" : "active"}>
                          {row.type}
                        </AdminStatus>
                      </td>
                      <td>{row.item}</td>
                      <td className="muted mono">{row.reference}</td>
                      <td className="ta-right strong">${row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <AdminEmptyState text="No payments yet." />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
