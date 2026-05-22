"use client";

import { useState } from "react";
import EventRSVPForm from "@/components/EventRSVPForm";

export default function EventRSVPSection({
  eventId,
  initialRegisteredCount,
  capacity,
}) {
  const [registeredCount, setRegisteredCount] = useState(
    initialRegisteredCount
  );

  const isSoldOut = capacity && registeredCount >= capacity;

  return (
    <>
      <div className="event-capacity-box">
        {capacity ? (
          <p>
            {registeredCount} / {capacity} registered
          </p>
        ) : (
          <p>{registeredCount} registered</p>
        )}

        {isSoldOut && <span>Sold Out</span>}
      </div>

      {isSoldOut ? (
        <p className="event-rsvp-message">
          This event is currently sold out.
        </p>
      ) : (
        <EventRSVPForm
          eventId={eventId}
          onSuccess={() => setRegisteredCount((count) => count + 1)}
        />
      )}
    </>
  );
}