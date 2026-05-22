"use client";

import { useState } from "react";

export default function AdminAssignMembershipForm({ userId, tiers }) {
  const [form, setForm] = useState({
    tierId: "",
    status: "ACTIVE",
    startDate: "",
    endDate: "",
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const res = await fetch(`/api/admin/users/${userId}/membership`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setSaving(false);
    setMessage(data.message);

    if (res.ok) {
      window.location.reload();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-membership-form">
      <select
        value={form.tierId}
        onChange={(e) =>
          setForm({
            ...form,
            tierId: e.target.value,
          })
        }
        required
      >
        <option value="">Select membership tier</option>

        {tiers.map((tier) => (
          <option key={tier.id} value={tier.id}>
            {tier.title} — ${tier.price}
          </option>
        ))}
      </select>

      <select
        value={form.status}
        onChange={(e) =>
          setForm({
            ...form,
            status: e.target.value,
          })
        }
        required
      >
        <option value="ACTIVE">ACTIVE</option>
        <option value="PENDING">PENDING</option>
        <option value="EXPIRED">EXPIRED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <input
        type="date"
        value={form.startDate}
        onChange={(e) =>
          setForm({
            ...form,
            startDate: e.target.value,
          })
        }
      />

      <input
        type="date"
        value={form.endDate}
        onChange={(e) =>
          setForm({
            ...form,
            endDate: e.target.value,
          })
        }
      />

      <button type="submit" disabled={saving} className="admin-primary-btn">
        {saving ? "Assigning..." : "Assign Membership"}
      </button>

      {message && <p className="admin-form-message">{message}</p>}
    </form>
  );
}