export const dynamic = "force-dynamic";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EventDetailsPage({ params }) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!event || !event.active) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative flex min-h-screen items-end overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
            {new Date(event.startDate).toLocaleDateString()} · {event.location}
          </p>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.95] md:text-7xl xl:text-8xl">
            {event.title}
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70 md:text-xl">
            {event.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white/90">
              RSVP Now
            </button>

            <Link
              href="/events"
              className="rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-white/10"
            >
              All Events
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
              About The Event
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Strategic global dialogue and business networking.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-white/70">
            <p>{event.description}</p>

            <p>
              This event reflects ABGCC’s mission to strengthen economic ties,
              commercial relationships, and strategic partnerships between the
              Balkans, the United States, and global stakeholders.
            </p>

            <p>
              Participants will have opportunities for networking, dialogue,
              collaboration, and cross-border business development.
            </p>
          </div>
        </div>
      </section>

      {event.images.length > 0 && (
        <section className="border-t border-white/10 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                Event Gallery
              </p>

              <h2 className="text-4xl font-bold md:text-5xl">
                Moments from the event.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {event.images.map((image) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10"
                >
                  <div className="relative aspect-4/5">
                    <Image
                      src={image.url}
                      alt={event.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-white/5 p-10 text-center md:p-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
            Join The Experience
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Reserve your place.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Connect with business leaders, investors, innovators, institutions,
            and partners shaping international collaboration and opportunity.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white/90">
            RSVP Registration
          </button>
        </div>
      </section>
    </main>
  );
}