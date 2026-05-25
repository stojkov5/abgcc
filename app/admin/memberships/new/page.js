"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/MotionReveal";

import "../../../../styles/admin.css";

export default function NewMembershipTierPage() {
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
    <main className="admin-page">
      <section className="admin-form-shell">
        <div className="admin-form-card">
          <Reveal>
            <Link href="/admin/memberships" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Memberships
            </Link>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="admin-eyebrow">Admin</p>
          </Reveal>

          <Reveal delay={0.12}>
            <h1 className="admin-form-title">
              Add Membership Tier
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="admin-form-text">
              Create a new membership tier with pricing, billing period,
              description, and visibility status.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <form
              onSubmit={handleSubmit}
              className="admin-form"
            >
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
                className="admin-input"
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
                className="admin-input admin-textarea"
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
                className="admin-input"
              />

              <select
                value={form.period}
                onChange={(e) =>
                  setForm({
                    ...form,
                    period: e.target.value,
                  })
                }
                className="admin-input"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <label className="admin-check-row">
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
                className="admin-submit-btn"
              >
                {loading ? "Creating..." : "Create Tier"}
              </button>
            </form>
          </Reveal>

          {message && (
            <Reveal delay={0.1}>
              <p className="admin-form-message">
                {message}
              </p>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
}