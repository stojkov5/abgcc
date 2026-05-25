export const dynamic = "force-dynamic";
export const revalidate = 0;

import "../../styles/events.css";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import HeroVideo from "@/components/HeroVideo";

import { Reveal, Stagger, StaggerItem } from "@/components/MotionReveal";

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "").slice(0, 160) || "";
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: {
      active: true,
      archived: false,
    },
    orderBy: {
      startDate: "asc",
    },
  });

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

            <Reveal delay={0.2}>
              <div className="mt-8 flex justify-center">
                <Link href="#events-list" className="primary-hero-btn">
                  View Events <ArrowRight size={17} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="page-hero-bottom-text">
          Discover upcoming gatherings, forums, networking experiences, business
          summits, and collaborative international initiatives organized by the
          American Balkan Global Chamber of Commerce.
        </div>
      </section>

      <section className="events-list-section" id="events-list">
        <div className="page-container">
          <Reveal className="section-heading">
            <span className="section-label">Upcoming Events</span>

            <h2>Connect with leaders, investors, and global partners.</h2>
          </Reveal>

          {events.length > 0 ? (
            <Stagger className="events-grid">
              {events.map((event) => (
                <StaggerItem
                  as="article"
                  key={event.id}
                  className="event-card"
                >
                  <div className="event-image-wrap">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="event-img"
                    />

                    <div className="event-image-overlay" />
                  </div>

                  <div className="event-content">
                    <div className="event-meta">
                      <span>
                        <CalendarDays size={16} />

                        {new Date(event.startDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>

                      {event.location && (
                        <span>
                          <MapPin size={16} />
                          {event.location}
                        </span>
                      )}
                    </div>

                    <h3>{event.title}</h3>

                    <p>{stripHtml(event.description)}</p>

                    <Link href={`/events/${event.slug}`} className="event-btn">
                      View Event <ArrowRight size={16} />
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Reveal className="events-empty-card">
              <span className="section-label">No Events</span>

              <h2>No upcoming events right now.</h2>

              <p>
                Please check back soon for upcoming ABGCC forums, networking
                experiences, and business gatherings.
              </p>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
}