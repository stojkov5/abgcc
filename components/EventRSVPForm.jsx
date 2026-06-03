"use client";

import { useState } from "react";

export default function EventRSVPForm({ eventId, isPaid, price, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

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

    try {
      // Paid event → Stripe Checkout
      if (isPaid) {
        const res = await fetch(`/api/events/${eventId}/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
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

      // Free event → direct RSVP
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);
      setIsError(!res.ok);
      setStatusMessage(data.message);

      if (res.ok) {
        setForm({ name: "", email: "", company: "", message: "" });
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
    ? `Reserve & Pay $${price}`
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
