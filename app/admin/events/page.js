export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
              Admin Panel
            </p>

            <h1 className="text-5xl font-black">
              Events
            </h1>
          </div>

          <Link
            href="/admin/events/new"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white/90"
          >
            Create Event
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-5 text-left text-sm uppercase tracking-[0.15em] text-white/60">
                  Title
                </th>

                <th className="px-6 py-5 text-left text-sm uppercase tracking-[0.15em] text-white/60">
                  Location
                </th>

                <th className="px-6 py-5 text-left text-sm uppercase tracking-[0.15em] text-white/60">
                  Date
                </th>

                <th className="px-6 py-5 text-left text-sm uppercase tracking-[0.15em] text-white/60">
                  Status
                </th>

                <th className="px-6 py-5 text-right text-sm uppercase tracking-[0.15em] text-white/60">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-white/10"
                >
                  <td className="px-6 py-5 font-semibold">
                    {event.title}
                  </td>

                  <td className="px-6 py-5 text-white/70">
                    {event.location}
                  </td>

                  <td className="px-6 py-5 text-white/70">
                    {new Date(event.startDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${
                        event.active
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {event.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="text-sm font-semibold text-white/70 transition hover:text-white"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}