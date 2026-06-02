export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import DeleteEventButton from "@/components/DeleteEventButton";

import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminStatus,
} from "@/components/admin/AdminUI";

import "@/styles/admin-events.css";

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const events = await prisma.event.findMany({
    include: {
      bookings: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return (
    <AdminShell>
      <div className="admin-events-page">
        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Events"
          text="Create, edit, publish, and manage ABGCC events from one clear dashboard."
          action={
            <Link href="/admin/events/new" className="admin-events-create-btn">
              <Plus size={17} />
              Create Event
            </Link>
          }
        />

        <AdminPanel title={`All Events (${events.length})`}>
          {events.length > 0 ? (
            <div className="admin-events-table-card">
              <div className="admin-events-table-wrap">
                <table className="admin-events-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Registrations</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="admin-events-table-actions">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <span className="admin-events-title">
                            {event.title}
                          </span>
                        </td>

                        <td>
                          {event.bookings.length}
                          {event.capacity ? ` / ${event.capacity}` : ""}
                        </td>

                        <td>{event.location || "No location"}</td>

                        <td>
                          {event.startDate
                            ? new Date(event.startDate).toLocaleDateString()
                            : "No date"}
                        </td>

                        <td>
                          <AdminStatus
                            variant={event.active ? "active" : "inactive"}
                          >
                            {event.active ? "Active" : "Inactive"}
                          </AdminStatus>
                        </td>

                        <td className="admin-events-table-actions">
                          <div className="admin-events-actions-group">
                            <Link
                              href={`/admin/events/${event.id}/edit`}
                              className="admin-events-table-link"
                            >
                              Edit <ArrowRight size={14} />
                            </Link>

                            <DeleteEventButton
                              eventId={event.id}
                              eventTitle={event.title}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <AdminEmptyState text="No events found." />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}