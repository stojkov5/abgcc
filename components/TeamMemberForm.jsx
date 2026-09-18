"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

// Shared form for creating and editing About-page people cards. Pass a `member`
// to edit an existing one; omit it to create a new one.
export default function TeamMemberForm({ member = null }) {
  const router = useRouter();
  const isEdit = Boolean(member);

  const [form, setForm] = useState({
    name: member?.name || "",
    role: member?.role || "",
    image: member?.image || "",
    bio: member?.bio || "",
    linkedin: member?.linkedin || "",
    section: member?.section || "TEAM",
    imagePosition: member?.imagePosition || "center top",
    visible: member?.visible ?? true,
    order: member?.order ?? 0,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Image upload failed.");
      } else {
        update("image", data.url);
        setMessage("Image uploaded successfully.");
      }
    } catch {
      setMessage("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.image) {
      setMessage("Please upload a photo before saving.");
      return;
    }

    setLoading(true);
    setMessage("");

    const url = isEdit ? `/api/admin/team/${member.id}` : "/api/admin/team";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setMessage(data.message);
    setLoading(false);

    if (res.ok) {
      router.push("/admin/team");
      router.refresh();
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="admin-event-form">
        <label className="admin-event-upload-label">Section</label>
        <select
          value={form.section}
          onChange={(e) => update("section", e.target.value)}
          className="admin-event-input"
        >
          <option value="TEAM">Meet the Team</option>
          <option value="ADVISORY">Advisory Board</option>
        </select>

        <input
          type="text"
          placeholder="Full name (e.g. Eliza Prendzov - President)"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="admin-event-input"
        />

        <input
          type="text"
          placeholder="Role / title (e.g. CEO & Co-Founder)"
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
          className="admin-event-input"
        />

        <div className="admin-event-editor-box">
          <p>Bio (optional)</p>
          <textarea
            placeholder="Short biography…"
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            className="admin-event-input"
            rows={4}
          />
        </div>

        <input
          type="url"
          placeholder="LinkedIn profile URL (optional)"
          value={form.linkedin}
          onChange={(e) => update("linkedin", e.target.value)}
          className="admin-event-input"
        />

        <div className="admin-event-upload-box">
          <label className="admin-event-upload-label">
            <Upload size={16} />
            Photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="admin-event-input"
          />

          {uploading && <p className="admin-event-note">Uploading image…</p>}

          {form.image && (
            <div className="admin-event-image-preview">
              <div className="admin-event-image-preview-inner">
                <Image
                  src={form.image}
                  alt="Member photo"
                  fill
                  className="admin-event-preview-img"
                  style={{ objectPosition: form.imagePosition }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="admin-event-form-grid">
          <div>
            <label className="admin-event-upload-label">Photo crop</label>
            <select
              value={form.imagePosition}
              onChange={(e) => update("imagePosition", e.target.value)}
              className="admin-event-input"
            >
              <option value="center top">Center top</option>
              <option value="center center">Center</option>
              <option value="center 18%">Center 18%</option>
              <option value="center bottom">Center bottom</option>
              <option value="left top">Left top</option>
              <option value="right top">Right top</option>
            </select>
          </div>

          <div>
            <label className="admin-event-upload-label">Display order</label>
            <input
              type="number"
              placeholder="0"
              value={form.order}
              onChange={(e) => update("order", e.target.value)}
              className="admin-event-input"
            />
          </div>
        </div>

        <p className="admin-event-note">
          Lower display order appears first within its section.
        </p>

        <div className="admin-event-check-grid">
          <label className="admin-event-check-row">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => update("visible", e.target.checked)}
            />
            <span>Show on public About page</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="admin-event-submit-btn"
        >
          {loading
            ? isEdit
              ? "Saving…"
              : "Creating…"
            : isEdit
              ? "Save Changes"
              : "Create Member"}
        </button>
      </form>

      {message && <p className="admin-event-form-message">{message}</p>}
    </>
  );
}
