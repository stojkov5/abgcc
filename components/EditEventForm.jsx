"use client";

import Image from "next/image";
import { useState } from "react";
import { Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    archived: event.archived || false,
  });

  const [galleryImages, setGalleryImages] = useState(event.images || []);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  async function safeJson(res) {
    const text = await res.text();
    if (!text) return { message: "No response from server." };
    return JSON.parse(text);
  }

  async function handleSaveChanges(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch(`/api/admin/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    <>
      <form onSubmit={handleSaveChanges} className="admin-form">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="admin-input"
        />

        <motion.textarea
          whileFocus={{ scale: 1.01 }}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={6}
          className="admin-input admin-textarea"
        />

        <motion.input
          whileFocus={{ scale: 1.01 }}
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="admin-input"
        />

        <div className="admin-upload-box">
          <label className="admin-upload-label">
            <Upload size={16} />
            Hero Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={uploadHeroImage}
            className="admin-input"
          />

          {uploadingHero && (
            <p className="admin-upload-note">Uploading hero image...</p>
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
                  alt="Hero image"
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
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="admin-input"
        />

        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="number"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          className="admin-input"
        />

        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="datetime-local"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="admin-input"
        />

        <div className="admin-check-grid">
          <label className="admin-check-row">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
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

          <label className="admin-check-row">
            <input
              type="checkbox"
              checked={form.archived}
              onChange={(e) =>
                setForm({ ...form, archived: e.target.checked })
              }
            />
            <span>Archived</span>
          </label>
        </div>

        {form.archived && (
          <p className="admin-upload-note">
            This event is archived. It will stay in the admin panel but will be
            hidden from the public events page.
          </p>
        )}

        <div className="admin-upload-box">
          <label className="admin-upload-label">
            <Upload size={16} />
            Gallery Images
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={uploadGalleryImage}
            className="admin-input"
          />

          {uploadingGallery && (
            <p className="admin-upload-note">Uploading gallery image...</p>
          )}

          {galleryImages.length > 0 && (
            <div className="admin-gallery-grid">
              {galleryImages.map((img) => (
                <motion.div
                  key={img.id}
                  className="admin-gallery-item"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={img.url}
                    alt="Gallery image"
                    fill
                    className="admin-preview-img"
                  />

                  <button
                    type="button"
                    onClick={() => removeGalleryImage(img.id)}
                    className="admin-remove-image"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={saving || uploadingHero || uploadingGallery}
          className="admin-submit-btn"
          whileHover={
            !saving && !uploadingHero && !uploadingGallery
              ? { y: -2 }
              : undefined
          }
          whileTap={
            !saving && !uploadingHero && !uploadingGallery
              ? { scale: 0.98 }
              : undefined
          }
        >
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </form>

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
    </>
  );
}