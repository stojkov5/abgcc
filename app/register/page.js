"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/register", {
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
      setForm({
        name: "",
        email: "",
        password: "",
      });
    }
  }

  return (
    <main className="min-h-screen px-6 pb-20 pt-32 ">
      <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="mb-6 text-3xl font-bold">Create account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
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