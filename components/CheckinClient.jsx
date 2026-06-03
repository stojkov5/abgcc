"use client";

import { useState } from "react";

export default function CheckinClient({ booking }) {
  const [attended, setAttended] = useState(booking.attended);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function toggleAttended() {
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/admin/event-bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attended: !attended }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setAttended(!attended);
      setMessage(!attended ? "Checked in ✓" : "Check-in removed.");
    } else {
      setMessage(data.message || "Something went wrong.");
    }
  }

  return (
    <div className="checkin-card">
      <div className={`checkin-status ${attended ? "in" : "out"}`}>
        {attended ? "CHECKED IN" : "NOT CHECKED IN"}
      </div>

      <h2 className="checkin-name">{booking.name}</h2>
      <p className="checkin-ref">{booking.reference}</p>

      <div className="checkin-details">
        <div><span>Event</span><strong>{booking.eventTitle}</strong></div>
        <div><span>Email</span><strong>{booking.email}</strong></div>
        {booking.company && (
          <div><span>Company</span><strong>{booking.company}</strong></div>
        )}
        <div>
          <span>Payment</span>
          <strong>{booking.paid ? `Paid · $${booking.amountPaid}` : "Free RSVP"}</strong>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleAttended}
        disabled={loading}
        className={`checkin-btn ${attended ? "danger" : ""}`}
      >
        {loading
          ? "Saving..."
          : attended
          ? "Undo Check-in"
          : "Check In Attendee"}
      </button>

      {message && <p className="checkin-message">{message}</p>}
    </div>
  );
}
