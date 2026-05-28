"use client";

import { useState } from "react";

export default function NewMembershipTierForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    period: "yearly",
    active: true,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/memberships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setMessage(data.message);
    setLoading(false);

    if (res.ok) {
      window.location.href = "/admin/memberships";
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="admin-membership-form-ui">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          className="admin-membership-input"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          rows={5}
          className="admin-membership-input admin-membership-textarea"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
          className="admin-membership-input"
        />

        <select
          value={form.period}
          onChange={(e) =>
            setForm({
              ...form,
              period: e.target.value,
            })
          }
          className="admin-membership-input"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <label className="admin-membership-check-row">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({
                ...form,
                active: e.target.checked,
              })
            }
          />

          <span>Active</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="admin-membership-submit-btn"
        >
          {loading ? "Creating..." : "Create Tier"}
        </button>
      </form>

      {message && <p className="admin-membership-form-message">{message}</p>}
    </>
  );
}