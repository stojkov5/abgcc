"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/MotionReveal";

export default function EventsBrowser({ upcoming, past }) {
  const [tab, setTab] = useState("upcoming");

  // Sync the active tab with the URL hash so footer links (/events#past) work,
  // and so switching reflects in the URL — without forcing the page dynamic.
  useEffect(() => {
    const apply = () => {
      setTab(window.location.hash === "#past" ? "past" : "upcoming");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  function selectTab(next) {
    setTab(next);
    window.history.replaceState(null, "", next === "past" ? "#past" : "#upcoming");
  }

  const list = tab === "past" ? past : upcoming;
  const isPastTab = tab === "past";

  return (
    <>
      <Reveal className="section-heading center">
        <span className="section-label">ABGCC Events</span>
        <h2>
          {isPastTab
            ? "A look back at past gatherings."
            : "Connect with leaders, investors, and global partners."}
        </h2>
      </Reveal>

      {/* Tab switcher */}
      <div className="events-tabs" role="tablist" aria-label="Filter events">
        <button
          type="button"
          role="tab"
          aria-selected={!isPastTab}
          className={`events-tab ${!isPastTab ? "active" : ""}`}
          onClick={() => selectTab("upcoming")}
        >
          Upcoming
          <span className="events-tab-count">{upcoming.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={isPastTab}
          className={`events-tab ${isPastTab ? "active" : ""}`}
          onClick={() => selectTab("past")}
        >
          Past
          <span className="events-tab-count">{past.length}</span>
        </button>
      </div>

      {list.length > 0 ? (
        <Stagger className="events-grid" key={tab}>
          {list.map((event) => (
            <StaggerItem
              as="article"
              key={event.id}
              className={`event-card ${isPastTab ? "is-past" : ""}`}
            >
              <div className="event-image-wrap">
                <Image src={event.image} alt={event.title} fill className="event-img" />
                <div className="event-image-overlay" />
                {isPastTab && <span className="event-ended-badge">Ended</span>}
              </div>

              <div className="event-content">
                <div className="event-meta">
                  <span>
                    <CalendarDays size={16} />
                    {event.dateLabel}
                  </span>

                  {event.location && (
                    <span>
                      <MapPin size={16} />
                      {event.location}
                    </span>
                  )}
                </div>

                <h3>{event.title}</h3>
                <p>{event.preview}</p>

                <Link href={`/events/${event.slug}`} className="event-btn">
                  View Event <ArrowRight size={16} />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <Reveal className="events-empty-card">
          <span className="section-label">
            {isPastTab ? "No Past Events" : "No Upcoming Events"}
          </span>
          <h2>
            {isPastTab
              ? "No past events to show yet."
              : "No upcoming events right now."}
          </h2>
          <p>
            {isPastTab
              ? "Past ABGCC events will appear here once they have taken place."
              : "Please check back soon for upcoming ABGCC forums, networking experiences, and business gatherings."}
          </p>
        </Reveal>
      )}
    </>
  );
}
