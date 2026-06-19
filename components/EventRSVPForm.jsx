"use client";

import { useState } from "react";

export default function EventRSVPForm({
  eventId,
  pricing,
  viewerIsMember = false,
  onPricingChange,
  onSuccess,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    memberNumber: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Manual member-number entry (for members who aren't signed in)
  const [showMemberField, setShowMemberField] = useState(false);
  const [checkingMember, setCheckingMember] = useState(false);
  const [memberMsg, setMemberMsg] = useState("");
  const [memberMsgError, setMemberMsgError] = useState(false);

  const isPaid = pricing.effectivePrice > 0;
  const memberDiscount =
    pricing.isMember &&
    pricing.memberPrice != null &&
    pricing.memberPrice < pricing.nonMemberPrice;
  // Only worth offering manual member entry when a lower member rate exists.
  const memberRateAvailable =
    pricing.memberPrice != null &&
    pricing.memberPrice < pricing.nonMemberPrice;

  async function applyMemberNumber() {
    const number = form.memberNumber.trim();
    if (!number) {
      setMemberMsgError(true);
      setMemberMsg("Enter your member number.");
      return;
    }

    setCheckingMember(true);
    setMemberMsg("");
    setMemberMsgError(false);

    try {
      const res = await fetch(`/api/events/${eventId}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberNumber: number }),
      });

      const data = await res.json();
      setCheckingMember(false);

      if (res.ok && data.memberValid) {
        if (onPricingChange) {
          onPricingChange({
            nonMemberPrice: data.nonMemberPrice,
            memberPrice: data.memberPrice,
            effectivePrice: data.effectivePrice,
            isFree: data.isFree,
            isMember: data.isMember,
          });
        }
        setMemberMsgError(false);
        setMemberMsg("Member price applied.");
      } else {
        // No silent discount — keep the non-member price and tell them why.
        if (onPricingChange) {
          onPricingChange({
            nonMemberPrice: data.nonMemberPrice,
            memberPrice: data.memberPrice,
            effectivePrice: data.nonMemberPrice,
            isFree: data.nonMemberPrice <= 0,
            isMember: false,
          });
        }
        setMemberMsgError(true);
        setMemberMsg(
          "We couldn't find an active membership for that number. The standard price applies."
        );
      }
    } catch {
      setCheckingMember(false);
      setMemberMsgError(true);
      setMemberMsg("Couldn't verify your member number. Please try again.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatusMessage("");
    setIsError(false);

    if (!form.name.trim() || !form.email.trim()) {
      setIsError(true);
      setStatusMessage("Name and email are required.");
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      company: form.company,
      message: form.message,
      memberNumber: form.memberNumber.trim() || undefined,
    };

    try {
      // Paid (after any member discount) → Stripe Checkout
      if (isPaid) {
        const res = await fetch(`/api/events/${eventId}/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok && data.url) {
          window.location.href = data.url; // redirect to Stripe
          return;
        }

        setLoading(false);
        setIsError(true);
        setStatusMessage(data.message || "Could not start checkout.");
        return;
      }

      // Free (incl. free-for-members) → direct RSVP
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);
      setIsError(!res.ok);
      setStatusMessage(data.message);

      if (res.ok) {
        setForm({ name: "", email: "", company: "", message: "", memberNumber: "" });
        if (onSuccess) onSuccess();
      }
    } catch {
      setLoading(false);
      setIsError(true);
      setStatusMessage("Something went wrong. Please try again.");
    }
  }

  const buttonLabel = loading
    ? isPaid
      ? "Redirecting to payment..."
      : "Submitting..."
    : isPaid
    ? `Reserve & Pay $${pricing.effectivePrice}`
    : "Confirm RSVP";

  return (
    <form onSubmit={handleSubmit} className="event-rsvp-form">
      <div className="event-rsvp-grid">
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Company / Organization"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />

        <textarea
          placeholder="Message / Notes"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {viewerIsMember ? (
        memberDiscount && (
          <p className="event-rsvp-member-note">
            ✓ Member price applied to your account.
          </p>
        )
      ) : (
        memberRateAvailable && (
        <div className="event-rsvp-member-box">
          {!showMemberField ? (
            <button
              type="button"
              className="event-rsvp-member-toggle"
              onClick={() => setShowMemberField(true)}
            >
              Are you an ABGCC member? Enter your member number for member pricing.
            </button>
          ) : (
            <div className="event-rsvp-member-entry">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Member number"
                value={form.memberNumber}
                onChange={(e) =>
                  setForm({ ...form, memberNumber: e.target.value })
                }
              />
              <button
                type="button"
                onClick={applyMemberNumber}
                disabled={checkingMember}
              >
                {checkingMember ? "Checking..." : "Apply"}
              </button>
            </div>
          )}

          {memberMsg && (
            <p
              className={`event-rsvp-message ${memberMsgError ? "error" : ""}`}
            >
              {memberMsg}
            </p>
          )}
        </div>
        )
      )}

      <button type="submit" disabled={loading} className="event-detail-primary">
        {buttonLabel}
      </button>

      {isPaid && (
        <p className="event-rsvp-note">
          Secure payment via Stripe. Your ticket and entry QR code are emailed
          after payment.
        </p>
      )}

      {statusMessage && (
        <p className={`event-rsvp-message ${isError ? "error" : ""}`}>
          {statusMessage}
        </p>
      )}
    </form>
  );
}
