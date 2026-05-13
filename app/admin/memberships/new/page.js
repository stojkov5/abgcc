"use client";

import { useState } from "react";

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
    <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
          Admin
        </p>

        <h1 className="mb-8 text-4xl font-bold">
          Add Membership Tier
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <select
            value={form.period}
            onChange={(e) =>
              setForm({ ...form, period: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <label className="flex items-center gap-3 text-white/80">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({ ...form, active: e.target.checked })
              }
            />
            Active
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Tier"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-white/70">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}