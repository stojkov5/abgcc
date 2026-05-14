"use client";

import Image from "next/image";
import { useState } from "react";

export default function NewEventPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
    price: "0",
    capacity: "",
    startDate: "",
    active: true,
    featured: false,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setMessage("");

    const uploadData = new FormData();
    uploadData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = await res.json();

    setUploading(false);

    if (!res.ok) {
      setMessage(data.message || "Image upload failed.");
      return;
    }

    setForm({
      ...form,
      image: data.url,
    });

    setMessage("Image uploaded successfully.");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/events", {
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
      window.location.href = "/admin/events";
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
          Admin
        </p>

        <h1 className="mb-8 text-4xl font-bold">Create Event</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Event title"
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
            rows={6}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <label className="mb-3 block text-sm font-semibold text-white/70">
              Event Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />

            {uploading && (
              <p className="mt-3 text-sm text-white/60">
                Uploading image...
              </p>
            )}

            {form.image && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-video">
                  <Image
                    src={form.image}
                    alt="Uploaded event image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

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

          <label className="flex items-center gap-3 text-white/80">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
            />
            Featured
          </label>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Event"}
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