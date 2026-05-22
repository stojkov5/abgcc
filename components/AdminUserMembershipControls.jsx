"use client";

import { useState } from "react";

export default function AdminUserMembershipControls({ membership }) {
  const [form, setForm] = useState({
    status: membership.status,
    startDate: membership.startDate
      ? new Date(membership.startDate).toISOString().slice(0, 10)
      : "",
    endDate: membership.endDate
      ? new Date(membership.endDate).toISOString().slice(0, 10)
      : "",
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function updateMembership() {
    setSaving(true);
    setMessage("");

    const res = await fetch(`/api/admin/user-memberships/${membership.id}`, {
      method: "PATCH",
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

  async function deleteMembership() {
    const confirmed = window.confirm("Delete this membership record?");
    if (!confirmed) return;

    const res = await fetch(`/api/admin/user-memberships/${membership.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    setMessage(data.message);

    if (res.ok) {
      window.location.reload();
    }
  }

  return (
    <div className="admin-user-membership-controls">
      <select
        value={form.status}
        onChange={(e) =>
          setForm({
            ...form,
            status: e.target.value,
          })
        }
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

      <div className="admin-user-membership-actions">
        <button type="button" onClick={updateMembership} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>

        <button type="button" onClick={deleteMembership}>
          Delete
        </button>
      </div>

      {message && <p className="admin-form-message">{message}</p>}
    </div>
  );
}