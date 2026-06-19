"use client";

import Image from "next/image";
import { useState } from "react";
import { Upload } from "lucide-react";

import EventPuckEditor from "@/components/puck/EventPuckEditor";

export default function NewEventForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
    nonMemberPrice: "0",
    memberPrice: "",
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

        <div className="admin-event-editor-box">
          <p>Event Description</p>

          <EventPuckEditor
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