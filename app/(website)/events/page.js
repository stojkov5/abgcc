// Events cached for 60 seconds — fresh enough, avoids DB hit on every visit
export const revalidate = 60;

export const metadata = {
  title: "Events",
  description:
    "Explore ABGCC events — from high-profile receptions during global gatherings to focused industry roundtables connecting business leaders, investors, and innovators.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events | ABGCC",
    description:
      "ABGCC events bring together business leaders, policymakers, investors, and innovators across the US and Balkans.",
    url: "/events",
  },
};

import "@/styles/events.css";
import { prisma } from "@/lib/prisma";
import HeroVideo from "@/components/HeroVideo";
import ScrollCue from "@/components/ScrollCue";

import { Reveal } from "@/components/MotionReveal";
import { getEventPreview } from "@/lib/puck/preview";
import EventsBrowser from "@/components/EventsBrowser";

function toCard(event) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    image: event.image,
    location: event.location || "",
    dateLabel: new Date(event.startDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    preview: getEventPreview(event.description),
  };
}

export default async function EventsPage() {
  const now = new Date();

  const events = await prisma.event.findMany({
    where: { active: true, archived: false },
    orderBy: { startDate: "asc" },
  });

  const upcoming = events
    .filter((e) => new Date(e.startDate) >= now)
    .map(toCard);

  // Past events: most recent first
  const past = events
    .filter((e) => new Date(e.startDate) < now)
    .reverse()
    .map(toCard);

  return (
    <main className="events-page">
      <section className="page-hero">
        <HeroVideo video="/Events.mp4" poster="/EventsPoster.webp" />

        <div className="page-hero-shell">
          <div className="page-hero-content">
            <Reveal delay={0.05}>
              <p className="page-hero-eyebrow">ABGCC Events</p>
            </Reveal>

            <Reveal delay={0.12}>
              <h1 className="page-hero-title title-dark">
                Strategic global events and networking experiences
              </h1>
            </Reveal>
          </div>
        </div>

        <div className="page-hero-bottom-text">
          Discover upcoming gatherings, forums, networking experiences, business
          summits, and collaborative international initiatives organized by the
          American Balkan Global Chamber of Commerce.
        </div>

        <ScrollCue />
      </section>

      <section className="events-list-section" id="events-list">
        <div className="page-container">
          <EventsBrowser upcoming={upcoming} past={past} />
        </div>
      </section>
    </main>
  );
}
