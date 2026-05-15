export const dynamic = "force-dynamic";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: {
      active: true,
    },

    orderBy: {
      startDate: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
            ABGCC Events
          </p>

          <h1 className="text-5xl font-black leading-none md:text-7xl">
            Strategic global events and networking experiences.
          </h1>

          <p className="mt-8 text-lg leading-8 text-white/70">
            Discover upcoming gatherings, forums, networking experiences,
            business summits, and collaborative international initiatives
            organized by the American Balkan Global Chamber of Commerce.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {events.map((event) => (
            <article
              key={event.id}
              className="group overflow-hidden rounded-4xl border border-white/10 bg-white/5"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              </div>

              <div className="p-8">
                <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/50">
                  {new Date(event.startDate).toLocaleDateString()}
                </p>

                <h2 className="text-3xl font-bold">
                  {event.title}
                </h2>

                <p className="mt-4 text-white/70">
                  {event.location}
                </p>

                <p className="mt-6 line-clamp-3 leading-7 text-white/70">
                  {event.description}
                </p>

                <Link
                  href={`/events/${event.slug}`}
                  className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white/90"
                >
                  View Event
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}