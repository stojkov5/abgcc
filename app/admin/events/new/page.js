"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";

import { Reveal } from "@/components/MotionReveal";

import "../../../../styles/admin.css";
import RichTextEditor from "../../../../components/ReactTextEdtior";

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
    <main className="admin-page">
      <section className="admin-form-shell">
        <div className="admin-form-card">
          <Reveal>
            <Link href="/admin/events" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Events
            </Link>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="admin-eyebrow">Admin</p>
          </Reveal>

          <Reveal delay={0.12}>
            <h1 className="admin-form-title">
              Create Event
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="admin-form-text">
              Add a new ABGCC event with image, location, capacity, price,
              publishing status, and featured visibility.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <form
              onSubmit={handleSubmit}
              className="admin-form"
            >
              <input
                type="text"
                placeholder="Event title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="admin-input"
              />

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
                  Event Description
                </p>

                <RichTextEditor
                  value={form.description}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      description: value,
                    })
                  }
                />
              </div>

              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
                className="admin-input"
              />

              <div className="admin-upload-box">
                <label className="admin-upload-label">
                  <Upload size={16} />
                  Event Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="admin-input"
                />

                {uploading && (
                  <p className="admin-upload-note">
                    Uploading image...
                  </p>
                )}

                {form.image && (
                  <Reveal>
                    <div className="admin-image-preview">
                      <div className="admin-image-preview-inner">
                        <Image
                          src={form.image}
                          alt="Uploaded event image"
                          fill
                          className="admin-preview-img"
                        />
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>

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

              <input
                type="number"
                placeholder="Capacity"
                value={form.capacity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    capacity: e.target.value,
                  })
                }
                className="admin-input"
              />

              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
                  })
                }
                className="admin-input"
              />

              <div className="admin-check-grid">
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

                <label className="admin-check-row">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        featured: e.target.checked,
                      })
                    }
                  />

                  <span>Featured</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || uploading}
                className="admin-submit-btn"
              >
                {loading ? "Creating..." : "Create Event"}
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