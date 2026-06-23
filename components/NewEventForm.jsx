"use client";

import Image from "next/image";
import { useState } from "react";
import { Upload } from "lucide-react";

import RichTextEditor from "@/components/RichTextEditor";

export default function NewEventForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
    titleColor: "",
    nonMemberPrice: "0",
    memberPrice: "",
    capacity: "",
    startDate: "",
    active: true,
    featured: false,
    galleryImages: [],
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUrl, setGalleryUrl] = useState("");

  function addGalleryImage(url) {
    setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, url] }));
  }

  function removeGalleryImage(index) {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  }

  async function uploadGalleryFile(e) {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const files = selected.slice(0, 10);
    const overLimit = selected.length > 10;

    setUploadingGallery(true);
    setMessage("");

    const urls = (
      await Promise.all(
        files.map(async (file) => {
          const uploadData = new FormData();
          uploadData.append("file", file);
          try {
            const res = await fetch("/api/admin/upload", {
              method: "POST",
              body: uploadData,
            });
            const data = await res.json();
            return res.ok ? data.url : null;
          } catch {
            return null;
          }
        })
      )
    ).filter(Boolean);

    setUploadingGallery(false);
    e.target.value = "";

    if (urls.length) {
      setForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...urls],
      }));
    }

    const failed = files.length - urls.length;
    setMessage(
      [
        urls.length
          ? `${urls.length} image${urls.length > 1 ? "s" : ""} added.`
          : "",
        failed ? `${failed} failed to upload.` : "",
        overLimit ? "Max 10 per batch — extra files were skipped." : "",
      ]
        .filter(Boolean)
        .join(" ")
    );
  }

  async function addGalleryFromUrl() {
    const url = galleryUrl.trim();
    if (!url) return;

    setUploadingGallery(true);
    setMessage("");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setUploadingGallery(false);

    if (!res.ok) {
      setMessage(data.message || "Could not add image from URL.");
      return;
    }

    addGalleryImage(data.url);
    setGalleryUrl("");
  }

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

    setForm((prev) => ({
      ...prev,
      image: data.url,
    }));

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
    <>
      <form onSubmit={handleSubmit} className="admin-event-form">
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
          className="admin-event-input"
        />

        <div className="admin-event-title-color">
          <label className="admin-event-check-row">
            <input
              type="checkbox"
              checked={!!form.titleColor}
              onChange={(e) =>
                setForm({
                  ...form,
                  titleColor: e.target.checked ? "#ffffff" : "",
                })
              }
            />
            <span>Custom title color (for readability over the hero photo)</span>
          </label>

          {form.titleColor && (
            <input
              type="color"
              value={form.titleColor}
              onChange={(e) =>
                setForm({ ...form, titleColor: e.target.value })
              }
              className="admin-event-color-input"
              aria-label="Title color"
            />
          )}
        </div>

        <div className="admin-event-editor-box">
          <p>Event Description</p>

          <RichTextEditor
            value={form.description}
            onChange={(value) =>
              setForm({
                ...form,
                description: value,
              })
            }
            placeholder="Describe the event…"
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
          className="admin-event-input"
        />

        <div className="admin-event-upload-box">
          <label className="admin-event-upload-label">
            <Upload size={16} />
            Event Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="admin-event-input"
          />

          {uploading && (
            <p className="admin-event-note">Uploading image...</p>
          )}

          {form.image && (
            <div className="admin-event-image-preview">
              <div className="admin-event-image-preview-inner">
                <Image
                  src={form.image}
                  alt="Uploaded event image"
                  fill
                  className="admin-event-preview-img"
                />
              </div>
            </div>
          )}
        </div>

        <div className="admin-event-upload-box">
          <label className="admin-event-upload-label">
            <Upload size={16} />
            Event Gallery (optional — up to 10 at once)
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={uploadGalleryFile}
            className="admin-event-input"
          />

          <div className="admin-event-gallery-url">
            <input
              type="url"
              placeholder="…or paste an image URL"
              value={galleryUrl}
              onChange={(e) => setGalleryUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addGalleryFromUrl();
                }
              }}
              className="admin-event-input"
            />
            <button
              type="button"
              onClick={addGalleryFromUrl}
              disabled={uploadingGallery}
            >
              Add
            </button>
          </div>

          {uploadingGallery && (
            <p className="admin-event-note">Adding image to gallery…</p>
          )}

          {form.galleryImages.length > 0 && (
            <div className="admin-gallery-grid">
              {form.galleryImages.map((url, index) => (
                <div key={`${url}-${index}`} className="admin-gallery-item">
                  <Image
                    src={url}
                    alt="Gallery image"
                    fill
                    className="admin-preview-img"
                  />
                  <button
                    type="button"
                    className="admin-remove-image"
                    onClick={() => removeGalleryImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-event-form-grid">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Non-member price ($)"
            value={form.nonMemberPrice}
            onChange={(e) =>
              setForm({
                ...form,
                nonMemberPrice: e.target.value,
              })
            }
            className="admin-event-input"
          />

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Member price ($, optional)"
            value={form.memberPrice}
            onChange={(e) =>
              setForm({
                ...form,
                memberPrice: e.target.value,
              })
            }
            className="admin-event-input"
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
            className="admin-event-input"
          />
        </div>

        <p className="admin-event-note">
          Leave member price blank if members pay the same as everyone. Set it to
          0 to make the event free for members.
        </p>

        <input
          type="datetime-local"
          value={form.startDate}
          onChange={(e) =>
            setForm({
              ...form,
              startDate: e.target.value,
            })
          }
          className="admin-event-input"
        />

        <div className="admin-event-check-grid">
          <label className="admin-event-check-row">
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

          <label className="admin-event-check-row">
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
          className="admin-event-submit-btn"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {message && <p className="admin-event-form-message">{message}</p>}
    </>
  );
}