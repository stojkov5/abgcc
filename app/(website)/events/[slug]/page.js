export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import EventRSVPSection from "@/components/EventRSVPSection";
import { Render } from "@puckeditor/core/rsc";
import { puckConfig } from "@/components/puck/puck.config";
import { parsePuckData } from "@/lib/puck/preview";

import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/MotionReveal";

import "@/styles/event-details.css";
import "@/styles/puck-content.css";

function formatEventDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function EventDetailsPage({ params }) {
  const { slug } = await params;

  const event = await prisma.event.findFirst({
    where: {
      slug,
      archived: false,
    },
    include: {
      images: {
        orderBy: {
          createdAt: "desc",
        },
      },
      bookings: true,
    },
  });

  if (!event || !event.active) {
    notFound();
  }

  const registeredCount = event.bookings.length;

  // New events store Puck JSON; older events store legacy HTML/plain text.
  const puckData = parsePuckData(event.description);

  return (
    <main className="event-detail-page">
      <section className="event-detail-hero">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="event-detail-hero-img"
        />

        {/* <div className="event-detail-overlay" /> */}

        <div className="event-detail-hero-content">
          <Reveal delay={0.05}>
            <Link href="/events" className="event-detail-back">
              ← Back to events
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="event-detail-eyebrow">
              {formatEventDate(event.startDate)} · {event.location}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <h1 className="event-detail-title">{event.title}</h1>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="event-detail-actions">
              <Link href="#rsvp" className="event-detail-primary">
                RSVP Now
              </Link>

              <Link href="#details" className="event-detail-secondary">
                Event Details
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="event-detail-section event-detail-main-section" id="details">
        <div className="event-detail-container event-detail-layout">
          <aside className="event-detail-info-card">
            <Reveal>
              <span className="event-detail-label">Event Info</span>

              <div className="event-info-list">
                <div>
                  <strong>Date</strong>
                  <span>{formatEventDate(event.startDate)}</span>
                </div>

                <div>
                  <strong>Location</strong>
                  <span>{event.location}</span>
                </div>

                <div>
                  <strong>Price</strong>
                  <span>{event.price > 0 ? `$${event.price}` : "Free"}</span>
                </div>

                {event.capacity && (
                  <div>
                    <strong>Capacity</strong>
                    <span>
                      {registeredCount} / {event.capacity} registered
                    </span>
                  </div>
                )}
              </div>

              <Link href="#rsvp" className="event-info-cta">
                Reserve your place
              </Link>
            </Reveal>
          </aside>

          <Reveal className="event-detail-article">
            <span className="event-detail-label">About The Event</span>

            {puckData ? (
              <div className="event-rich-content puck-content">
                <Render config={puckConfig} data={puckData} />
              </div>
            ) : (
              <div
                className="event-rich-content"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            )}
          </Reveal>
        </div>
      </section>

      {event.images.length > 0 && (
        <section className="event-detail-section">
          <div className="event-detail-container">
            <Reveal>
              <span className="event-detail-label">Event Gallery</span>

              <h2 className="event-detail-heading">
                Moments from the event.
              </h2>
            </Reveal>

            <Stagger className="event-gallery-grid">
              {event.images.map((image) => (
                <StaggerItem
                  as="article"
                  key={image.id}
                  className="event-gallery-card"
                >
                  <div className="event-gallery-img-wrap">
                    <Image
                      src={image.url}
                      alt={event.title}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      className="event-gallery-img"
                    />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section className="event-detail-section" id="rsvp">
        <div className="event-detail-container">
          <Reveal className="event-rsvp-card">
            <span className="event-detail-label">Join The Experience</span>

            <h2 className="event-detail-heading">
              Reserve your place.
            </h2>

            <p className="event-detail-text">
              Connect with business leaders, investors, innovators,
              institutions, and partners shaping international collaboration and
              opportunity.
            </p>

            <EventRSVPSection
              eventId={event.id}
              initialRegisteredCount={registeredCount}
              capacity={event.capacity}
              price={event.price}
            />
          </Reveal>
        </div>
      </section>
    </main>
  );
}