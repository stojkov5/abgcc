"use client";

import Image from "next/image";
import { useState } from "react";

export default function EditEventForm({ event }) {
  const [form, setForm] = useState({
    title: event.title,
    description: event.description,
    location: event.location,
    image: event.image,
    price: event.price,
    capacity: event.capacity || "",
    startDate: new Date(event.startDate).toISOString().slice(0, 16),
    active: event.active,
    featured: event.featured,
  });

  const [galleryImages, setGalleryImages] = useState(event.images || []);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  async function safeJson(res) {
    const text = await res.text();

    if (!text) {
      return { message: "No response from server." };
    }

    return JSON.parse(text);
  }

  async function handleSaveChanges() {
    setSaving(true);
    setMessage("");

    const res = await fetch(`/api/admin/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await safeJson(res);

    setSaving(false);
    setMessage(data.message);

    if (res.ok) {
      window.location.href = "/admin/events";
    }
  }

  async function uploadHeroImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    setMessage("");

    const uploadData = new FormData();
    uploadData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = await safeJson(res);

    setUploadingHero(false);

    if (!res.ok) {
      setMessage(data.message || "Hero image upload failed.");
      return;
    }

    setForm({ ...form, image: data.url });
    setMessage("Hero image uploaded.");
  }

  async function uploadGalleryImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    setMessage("");

    const uploadData = new FormData();
    uploadData.append("file", file);

    const res = await fetch(`/api/admin/events/${event.id}/gallery`, {
      method: "POST",
      body: uploadData,
    });

    const data = await safeJson(res);

    setUploadingGallery(false);

    if (!res.ok) {
      setMessage(data.message || "Gallery image upload failed.");
      return;
    }

    setGalleryImages([data.image, ...galleryImages]);
    setMessage("Gallery image uploaded.");
  }

  async function removeGalleryImage(imageId) {
    const confirmDelete = window.confirm("Remove this gallery image?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/admin/events/gallery/${imageId}`, {
      method: "DELETE",
    });

    const data = await safeJson(res);

    if (res.ok) {
      setGalleryImages(galleryImages.filter((image) => image.id !== imageId));
      setMessage("Gallery image removed.");
    } else {
      setMessage(data.message || "Could not remove gallery image.");
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
              Admin
            </p>

            <h1 className="text-4xl font-bold">Edit Event</h1>
          </div>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving || uploadingHero || uploadingGallery}
            className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={6}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <p className="mb-3 text-sm font-semibold text-white/70">
              Hero Image
            </p>

            <input type="file" accept="image/*" onChange={uploadHeroImage} />

            {uploadingHero && (
              <p className="mt-3 text-sm text-white/60">Uploading...</p>
            )}

            {form.image && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-video">
                  <Image
                    src={form.image}
                    alt="Hero image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <label className="flex items-center gap-3 text-white/80">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
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

          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <p className="mb-3 text-sm font-semibold text-white/70">
              Gallery Images
            </p>

            <input type="file" accept="image/*" onChange={uploadGalleryImage} />

            {uploadingGallery && (
              <p className="mt-3 text-sm text-white/60">Uploading...</p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-white/10"
                >
                  <Image
                    src={img.url}
                    alt="Gallery image"
                    fill
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeGalleryImage(img.id)}
                    className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-bold text-white backdrop-blur transition hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {message && <p className="text-sm text-white/70">{message}</p>}
        </div>
      </section>
    </main>
  );
}