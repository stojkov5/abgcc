export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HeroReveal,
  HeroItem,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/MotionReveal";
import "../../../styles/event-details.css";

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
  },
});
  if (!event || !event.active) {
    notFound();
  }

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

        <div className="event-detail-overlay" />

        <div className="event-detail-hero-content">
          <HeroReveal>
            <HeroItem as="p" className="event-detail-eyebrow">
              {new Date(event.startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · {event.location}
            </HeroItem>

            <HeroItem as="h1" className="event-detail-title">
              {event.title}
            </HeroItem>

            <HeroItem as="p" className="event-detail-text">
              {event.description}
            </HeroItem>

            <HeroItem>
              <div className="event-detail-actions">
                <button className="event-detail-primary">
                  RSVP Now
                </button>

                <Link href="/events" className="event-detail-secondary">
                  All Events
                </Link>
              </div>
            </HeroItem>
          </HeroReveal>
        </div>
      </section>

      <section className="event-detail-section">
        <div className="event-detail-container event-detail-grid">
          <Reveal amount={0.35}>
            <span className="event-detail-label">About The Event</span>

            <h2 className="event-detail-heading">
              Strategic global dialogue and business networking.
            </h2>
          </Reveal>

          <Reveal className="event-detail-copy" amount={0.35}>
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
          </Reveal>
        </div>
      </section>

      {event.images.length > 0 && (
        <section className="event-detail-section">
          <div className="event-detail-container">
            <Reveal amount={0.35}>
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
                      className="event-gallery-img"
                    />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section className="event-detail-section">
        <div className="event-detail-container">
          <Reveal className="event-rsvp-card" amount={0.35}>
            <span className="event-detail-label">Join The Experience</span>

            <h2 className="event-detail-heading">
              Reserve your place.
            </h2>

            <p className="event-detail-text">
              Connect with business leaders, investors, innovators,
              institutions, and partners shaping international collaboration and
              opportunity.
            </p>

            <div className="event-detail-actions">
              <button className="event-detail-primary">
                RSVP Registration
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}