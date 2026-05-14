import Image from "next/image";
import Link from "next/link";

const galleryImages = [
  "/events/unga-week/image1.webp",
  "/events/unga-week/image2.webp",
  "/events/unga-week/image3.webp",
  "/events/unga-week/image4.webp",
  "/events/unga-week/image5.webp",
  "/events/unga-week/image6.webp",
  "/events/unga-week/image7.webp",
  "/events/unga-week/image8.webp",
  "/events/unga-week/image9.webp",
];

export default function UNGAWeekPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative flex min-h-screen items-end overflow-hidden">
        <Image
          src="/events/unga-week/image1.jpg"
          alt="UNGA Week"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
            September 2025 · New York City
          </p>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.95] md:text-7xl xl:text-8xl">
            Chamber UNGA Week 2025
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70 md:text-xl">
            A high-level gathering connecting business leaders, investors,
            diplomats, innovators, and institutions across the United States,
            the Balkans, and global markets.
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
              Strategic global dialogue during UNGA Week.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-white/70">
            <p>
              The American Balkan Global Chamber of Commerce brings together
              influential voices from finance, policy, entrepreneurship,
              infrastructure, technology, sustainability, and international
              development.
            </p>

            <p>
              During Chamber UNGA Week 2025, participants will engage in
              exclusive networking experiences, strategic discussions, and
              collaborative opportunities focused on cross-border growth and
              investment.
            </p>

            <p>
              The event reflects ABGCC’s mission to strengthen economic ties
              between the Balkans, the United States, and international
              stakeholders.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                Event Gallery
              </p>

              <h2 className="text-4xl font-bold md:text-5xl">
                Chamber moments and experiences.
              </h2>
            </div>

            <p className="max-w-xl text-white/60">
              Highlights from previous meetings, strategic gatherings, business
              networking sessions, and international collaboration initiatives.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-white/10"
              >
                <div className="relative aspect-4/5">
                  <Image
                    src={image}
                    alt={`UNGA Week ${index + 1}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-white/5 p-10 text-center md:p-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
            Join The Experience
          </p>

          <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Reserve your place at Chamber UNGA Week 2025.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Connect with global business leaders, investors, innovators,
            institutions, and policy makers shaping international collaboration
            and opportunity.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white/90">
            RSVP Registration
          </button>
        </div>
      </section>
    </main>
  );
}