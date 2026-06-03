"use client";

import { useEffect, useState } from "react";
import EventRSVPForm from "@/components/EventRSVPForm";

export default function EventRSVPSection({
  eventId,
  initialRegisteredCount,
  capacity,
  price = 0,
}) {
  const [registeredCount, setRegisteredCount] = useState(
    initialRegisteredCount
  );
  const [justPaid, setJustPaid] = useState(false);

  const isPaid = price > 0;
  const isSoldOut = capacity && registeredCount >= capacity;

  // Detect return from Stripe Checkout (?booked=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("booked") === "1") {
      setJustPaid(true);
      setRegisteredCount((count) => count + 1);
      // Clean the URL so a refresh doesn't keep the banner
      window.history.replaceState({}, "", window.location.pathname + "#rsvp");
    }
  }, []);

  return (
    <>
      <div className="event-capacity-box">
        <p>
          {capacity
            ? `${registeredCount} / ${capacity} registered`
            : `${registeredCount} registered`}
        </p>

        <span className="event-price-tag">
          {isPaid ? `$${price}` : "Free"}
        </span>

        {isSoldOut && <span>Sold Out</span>}
      </div>

      {justPaid ? (
        <div className="event-rsvp-success">
          <div className="event-rsvp-success-icon">✓</div>
          <h3>Payment successful!</h3>
          <p>
            Your spot is confirmed. We&apos;ve emailed your ticket and entry QR
            code — please bring it to the event.
          </p>
        </div>
      ) : isSoldOut ? (
        <p className="event-rsvp-message">
          This event is currently sold out.
        </p>
      ) : (
        <EventRSVPForm
          eventId={eventId}
          isPaid={isPaid}
          price={price}
          onSuccess={() => setRegisteredCount((count) => count + 1)}
        />
      )}
    </>
  );
}
