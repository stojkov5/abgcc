export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import {
  HeroReveal,
  HeroItem,
  Reveal,
} from "@/components/MotionReveal";

import "../../../styles/admin.css";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: "desc",
    },
  });

  return (
    <main className="admin-page">
      <section className="admin-container">
        <div className="admin-topbar">
          <HeroReveal>
            <HeroItem as="p" className="admin-eyebrow">
              Admin Panel
            </HeroItem>

            <HeroItem as="h1" className="admin-title">
              Events
            </HeroItem>

            <HeroItem as="p" className="admin-text">
              Create, edit, publish, and manage ABGCC events from one clear
              dashboard.
            </HeroItem>
          </HeroReveal>

          <Link href="/admin/events/new" className="admin-primary-btn">
            <Plus size={17} />
            Create Event
          </Link>
        </div>

        <Reveal className="admin-table-card" amount={0.25}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="admin-table-actions">Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <span className="admin-table-title">
                        {event.title}
                      </span>
                    </td>

                    <td>{event.location}</td>

                    <td>
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>

                    <td>
                      <span
                        className={`admin-status ${
                          event.active ? "active" : "inactive"
                        }`}
                      >
                        {event.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="admin-table-actions">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="admin-table-link"
                      >
                        Edit <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>
    </main>
  );
}