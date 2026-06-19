"use client";

import { useState } from "react";
import Image from "next/image";
import { INDUSTRY_SECTORS } from "@/lib/directory/industries";

export default function AdminDirectoryProfileForm({ userId, user }) {
  const [form, setForm] = useState({
    organization: user.organization || "",
    logo: user.logo || "",
    companyDescription: user.companyDescription || "",
    website: user.website || "",
    industrySector: user.industrySector || "",
    industryTags: user.industryTags || "",
    keyContactName: user.keyContactName || "",
    keyContactTitle: user.keyContactTitle || "",
    keyContactEmail: user.keyContactEmail || "",
    address: user.address || "",
    bannerImage: user.bannerImage || "",
    featuredProjects: user.featuredProjects || "",
    directoryVisible:
      user.directoryVisible === undefined ? true : user.directoryVisible,
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleUpload(e, field) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    setMessage("");

    const uploadData = new FormData();
    uploadData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = await res.json();
    setUploading(null);

    if (!res.ok) {
      setMessage(data.message || "Upload failed.");
      return;
    }

    setField(field, data.url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch(`/api/admin/users/${userId}/directory`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);
    setMessage(data.message);

    if (res.ok) {
      window.location.reload();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-membership-form">
      <input
        type="text"
        placeholder="Company / Organization name"
        value={form.organization}
        onChange={(e) => setField("organization", e.target.value)}
      />

      <select
        value={form.industrySector}
        onChange={(e) => setField("industrySector", e.target.value)}
      >
        <option value="">Select industry sector…</option>
        {INDUSTRY_SECTORS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Industry tags (comma separated)"
        value={form.industryTags}
        onChange={(e) => setField("industryTags", e.target.value)}
      />

      <textarea
        placeholder="Company description"
        rows={5}
        value={form.companyDescription}
        onChange={(e) => setField("companyDescription", e.target.value)}
      />

      <input
        type="url"
        placeholder="Website (https://…)"
        value={form.website}
        onChange={(e) => setField("website", e.target.value)}
      />

      <input
        type="text"
        placeholder="Address"
        value={form.address}
        onChange={(e) => setField("address", e.target.value)}
      />

      <input
        type="text"
        placeholder="Key contact name"
        value={form.keyContactName}
        onChange={(e) => setField("keyContactName", e.target.value)}
      />

      <input
        type="text"
        placeholder="Key contact title"
        value={form.keyContactTitle}
        onChange={(e) => setField("keyContactTitle", e.target.value)}
      />

      <input
        type="email"
        placeholder="Key contact email"
        value={form.keyContactEmail}
        onChange={(e) => setField("keyContactEmail", e.target.value)}
      />

      <textarea
        placeholder="Featured projects / news (optional)"
        rows={3}
        value={form.featuredProjects}
        onChange={(e) => setField("featuredProjects", e.target.value)}
      />

      <div className="admin-directory-uploads">
        <div>
          <label className="admin-directory-upload-label">Company Logo</label>
          {form.logo && (
            <div className="admin-directory-thumb">
              <Image src={form.logo} alt="Logo" fill className="admin-directory-thumb-img" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, "logo")}
            disabled={uploading === "logo"}
          />
          {uploading === "logo" && <p className="admin-form-message">Uploading…</p>}
        </div>

        <div>
          <label className="admin-directory-upload-label">
            Featured Banner (Presidential)
          </label>
          {form.bannerImage && (
            <div className="admin-directory-thumb admin-directory-thumb--banner">
              <Image
                src={form.bannerImage}
                alt="Banner"
                fill
                className="admin-directory-thumb-img"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e, "bannerImage")}
            disabled={uploading === "bannerImage"}
          />
          {uploading === "bannerImage" && (
            <p className="admin-form-message">Uploading…</p>
          )}
        </div>
      </div>

      <label className="admin-directory-checkbox">
        <input
          type="checkbox"
          checked={form.directoryVisible}
          onChange={(e) => setField("directoryVisible", e.target.checked)}
        />
        <span>Visible in the Members Directory</span>
      </label>

      <button
        type="submit"
        disabled={saving || uploading}
        className="admin-primary-btn"
      >
        {saving ? "Saving…" : "Save Directory Profile"}
      </button>

      {message && <p className="admin-form-message">{message}</p>}
    </form>
  );
}
