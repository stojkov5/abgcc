export const dynamic = "force-dynamic";
export const revalidate = 0;

import "../../styles/events.css";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

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
    <main className="events-page">
      <section className="events-hero">
        <Image
          src="/Events.webp"
          alt="ABGCC Events"
          fill
          priority
          className="events-hero-img"
        />

        <div className="events-hero-overlay" />

       <div className="page-hero-shell">
  <div className="events-hero-content page-hero-content">
            <p className="events-eyebrow">ABGCC Events</p>

            <h1 className="events-title">
              Strategic global events and networking experiences.
            </h1>

            <p className="events-hero-text mx-auto">
              Discover upcoming gatherings, forums, networking experiences,
              business summits, and collaborative international initiatives
              organized by the American Balkan Global Chamber of Commerce.
            </p>

            <Link href="#events-list" className="events-hero-btn">
              View Events <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="events-list-section" id="events-list">
        <div className="events-container">
          <div className="section-heading">
            <span className="section-label">Upcoming Events</span>
            <h2>Connect with leaders, investors, and global partners.</h2>
          </div>

          {events.length > 0 ? (
            <div className="events-grid">
              {events.map((event) => (
                <article key={event.id} className="event-card">
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
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>

                      {event.location && (
                        <span>
                          <MapPin size={16} />
                          {event.location}
                        </span>
                      )}
                    </div>

                    <h3>{event.title}</h3>

                    <p>{event.description}</p>

                    <Link href={`/events/${event.slug}`} className="event-btn">
                      View Event <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="events-empty-card">
              <span className="section-label">No Events</span>
              <h2>No upcoming events right now.</h2>
              <p>
                Please check back soon for upcoming ABGCC forums, networking
                experiences, and business gatherings.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}