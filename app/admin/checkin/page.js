export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import CheckinClient from "@/components/CheckinClient";
import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUI";

import "@/styles/admin.css";
import "@/styles/checkin.css";

export default async function CheckinPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const sp = await searchParams;
  const ref = sp?.ref?.trim();

  let booking = null;
  let notFound = false;

  if (ref) {
    const found = await prisma.eventBooking.findUnique({
      where: { reference: ref },
      include: { event: true },
    });

    if (found) {
      booking = {
        id: found.id,
        name: found.name,
        email: found.email,
        company: found.company,
        reference: found.reference,
        attended: found.attended,
        paid: found.paid,
        amountPaid: found.amountPaid,
        eventTitle: found.event.title,
      };
    } else {
      notFound = true;
    }
  }

  return (
    <AdminShell>
      <div className="admin-checkin-page">
        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Event Check-in"
          text="Scan an attendee's QR code, or enter their reference, to verify and check them in at the door."
        />

        <AdminPanel title="Verify Ticket">
          <form method="GET" className="checkin-search">
            <input
              type="text"
              name="ref"
              defaultValue={ref || ""}
              placeholder="ABGCC-XXXXXXXX"
              autoComplete="off"
              autoFocus
            />
            <button type="submit">Look Up</button>
          </form>

          {notFound && (
            <p className="checkin-notfound">
              No ticket found for reference <strong>{ref}</strong>.
            </p>
          )}

          {booking && <CheckinClient booking={booking} />}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
