"use client";

import { useState } from "react";

export default function EventRSVPForm({ eventId }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setStatusMessage("");

    const res = await fetch(`/api/events/${eventId}/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setLoading(false);
    setStatusMessage(data.message);

    if (res.ok) {
      setForm({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="event-rsvp-form">
      <div className="event-rsvp-grid">
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Company / Organization"
          value={form.company}
          onChange={(e) =>
            setForm({
              ...form,
              company: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Message / Notes"
          rows={4}
          value={form.message}
          onChange={(e) =>
            setForm({
              ...form,
              message: e.target.value,
            })
          }
        />
      </div>

      <button type="submit" disabled={loading} className="event-detail-primary">
        {loading ? "Submitting..." : "Confirm RSVP"}
      </button>

      {statusMessage && (
        <p className="event-rsvp-message">{statusMessage}</p>
      )}
    </form>
  );
}