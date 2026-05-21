"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../../../styles/admin.css";
import RichTextEditor from "../../../../components/ReactTextEdtior";

const cardReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

const itemReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

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
        <motion.div
          className="admin-form-card"
          variants={cardReveal}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemReveal}>
            <Link href="/admin/events" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Events
            </Link>
          </motion.div>

          <motion.p variants={itemReveal} className="admin-eyebrow">
            Admin
          </motion.p>

          <motion.h1 variants={itemReveal} className="admin-form-title">
            Create Event
          </motion.h1>

          <motion.p variants={itemReveal} className="admin-form-text">
            Add a new ABGCC event with image, location, capacity, price,
            publishing status, and featured visibility.
          </motion.p>

          <motion.form
            variants={itemReveal}
            onSubmit={handleSubmit}
            className="admin-form"
          >
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Event title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
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

            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
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
                <motion.div
                  className="admin-image-preview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="admin-image-preview-inner">
                    <Image
                      src={form.image}
                      alt="Uploaded event image"
                      fill
                      className="admin-preview-img"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="admin-input"
            />

            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: e.target.value })
              }
              className="admin-input"
            />

            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="datetime-local"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
              className="admin-input"
            />

            <div className="admin-check-grid">
              <label className="admin-check-row">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                />
                <span>Active</span>
              </label>

              <label className="admin-check-row">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                />
                <span>Featured</span>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loading || uploading}
              className="admin-submit-btn"
              whileHover={!loading && !uploading ? { y: -2 } : undefined}
              whileTap={!loading && !uploading ? { scale: 0.98 } : undefined}
            >
              {loading ? "Creating..." : "Create Event"}
            </motion.button>
          </motion.form>

          <AnimatePresence>
            {message && (
              <motion.p
                className="admin-form-message"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}