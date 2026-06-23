"use client";

import Image from "next/image";
import { useState } from "react";
import { Upload } from "lucide-react";

import RichTextEditor from "@/components/RichTextEditor";

export default function NewPostForm() {
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    published: true,
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

    setForm((prev) => ({ ...prev, coverImage: data.url }));
    setMessage("Cover image uploaded.");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);

    if (res.ok) {
      window.location.href = "/admin/posts";
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="admin-event-form">
        <input
          type="text"
          placeholder="Article title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="admin-event-input"
        />

        <textarea
          placeholder="Short summary (shown on the news list cards)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="admin-event-input"
          rows={3}
        />

        <input
          type="text"
          placeholder="Author (optional)"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="admin-event-input"
        />

        <div className="admin-event-upload-box">
          <label className="admin-event-upload-label">
            <Upload size={16} />
            Cover Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="admin-event-input"
          />

          {uploading && <p className="admin-event-note">Uploading image...</p>}

          {form.coverImage && (
            <div className="admin-event-image-preview">
              <div className="admin-event-image-preview-inner">
                <Image
                  src={form.coverImage}
                  alt="Cover image"
                  fill
                  className="admin-event-preview-img"
                />
              </div>
            </div>
          )}
        </div>

        <div className="admin-event-editor-box">
          <p>Article Content</p>

          <RichTextEditor
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
            placeholder="Write the article…"
          />
        </div>

        <div className="admin-event-check-grid">
          <label className="admin-event-check-row">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            <span>Published</span>
          </label>

          <label className="admin-event-check-row">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <span>Featured</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="admin-event-submit-btn"
        >
          {loading ? "Publishing..." : "Publish Article"}
        </button>
      </form>

      {message && <p className="admin-event-form-message">{message}</p>}
    </>
  );
}
