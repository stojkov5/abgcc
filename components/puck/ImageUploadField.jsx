"use client";

import { useState } from "react";

// Custom Puck field that reuses the existing Cloudinary upload endpoint
// (/api/admin/upload) so images placed inside event content are stored the
// same way as event hero / gallery images.
export default function ImageUploadField({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Image upload failed.");
      }

      onChange(data.url);
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="puck-upload-field">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="puck-upload-preview" />
      ) : (
        <div className="puck-upload-placeholder">No image selected</div>
      )}

      <label className="puck-upload-btn">
        {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        <input type="file" accept="image/*" onChange={handleUpload} hidden />
      </label>

      <input
        type="text"
        className="puck-upload-url"
        placeholder="or paste an image URL"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />

      {error ? <p className="puck-upload-error">{error}</p> : null}
    </div>
  );
}
