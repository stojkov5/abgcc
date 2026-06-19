"use client";

import { useEffect, useState } from "react";
import EventRSVPForm from "@/components/EventRSVPForm";

// Mirrors lib/events/pricing.js computeEventPrice for the initial client render.
// The server is always the source of truth; this just seeds the UI.
function clientPricing({ nonMemberPrice, memberPrice, isMember }) {
  const base = Number(nonMemberPrice || 0);
  const hasMemberPrice = memberPrice != null;
  const member = hasMemberPrice ? Number(memberPrice) : null;
  const effectivePrice = isMember && hasMemberPrice ? member : base;

  return {
    nonMemberPrice: base,
    memberPrice: member,
    effectivePrice,
    isFree: effectivePrice <= 0,
    isMember: Boolean(isMember),
  };
}

export default function EventRSVPSection({
  eventId,
  initialRegisteredCount,
  capacity,
  nonMemberPrice = 0,
  memberPrice = null,
  viewerIsMember = false,
  isPast = false,
}) {
  const [registeredCount, setRegisteredCount] = useState(
    initialRegisteredCount
  );
  const [justPaid, setJustPaid] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [pricing, setPricing] = useState(() =>
    clientPricing({ nonMemberPrice, memberPrice, isMember: viewerIsMember })
  );

  const isPaid = pricing.effectivePrice > 0;
  const isSoldOut = capacity && registeredCount >= capacity;

  // Show the non-member price struck through when a member rate is in effect.
  const showMemberDiscount =
    pricing.isMember &&
    pricing.memberPrice != null &&
    pricing.memberPrice < pricing.nonMemberPrice;

  // Detect return from Stripe Checkout (?session_id=...) and fulfill the booking
  useEffect(() => {
    if (isPast) return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    setConfirming(true);

    fetch("/api/events/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setJustPaid(true);
          setRegisteredCount((count) => count + 1);
        }
      })
      .catch(() => {})
      .finally(() => {
        setConfirming(false);
        // Clean the URL so a refresh doesn't re-trigger
        window.history.replaceState({}, "", window.location.pathname + "#rsvp");
      });
  }, []);

  function priceText(value) {
    return value > 0 ? `$${value}` : "Free";
  }

  return (
    <>
      <div className="event-capacity-box">
        <p>
          {capacity
            ? `${registeredCount} / ${capacity} registered`
            : `${registeredCount} registered`}
        </p>

        {showMemberDiscount ? (
          <span className="event-price-tag">
            <span className="event-price-was">
              {priceText(pricing.nonMemberPrice)}
            </span>
            {priceText(pricing.effectivePrice)}
          </span>
        ) : (
          <span className="event-price-tag">
            {priceText(pricing.effectivePrice)}
          </span>
        )}

        {isPast ? (
          <span className="event-ended-tag">Ended</span>
        ) : (
          isSoldOut && <span>Sold Out</span>
        )}
      </div>

      {isPast ? (
        <div className="event-rsvp-closed">
          <div className="event-rsvp-closed-icon">🗓</div>
          <h3>Registration Closed</h3>
          <p>This event has already taken place. Registration is no longer available.</p>
        </div>
      ) : confirming ? (
        <div className="event-rsvp-success">
          <div className="event-rsvp-spinner" />
          <h3>Confirming your booking...</h3>
          <p>Please wait a moment while we finalize your ticket.</p>
        </div>
      ) : justPaid ? (
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
          pricing={pricing}
          viewerIsMember={viewerIsMember}
          onPricingChange={setPricing}
          onSuccess={() => setRegisteredCount((count) => count + 1)}
        />
      )}
    </>
  );
}
