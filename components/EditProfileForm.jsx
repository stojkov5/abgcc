"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { INDUSTRY_SECTORS } from "@/lib/directory/industries";

export default function EditProfileForm({ user }) {
  const { update } = useSession();

  const [form, setForm] = useState({
    name: user.name || "",
    organization: user.organization || "",
    position: user.position || "",
    phone: user.phone || "",
    bio: user.bio || "",
    photo: user.photo || "",
    // Directory / company profile
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState(null); // "logo" | "bannerImage" | null

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setMessage("");

    const uploadData = new FormData();
    uploadData.append("file", file);

    const res = await fetch("/api/portal/profile/photo", {
      method: "POST",
      body: uploadData,
    });

    const data = await res.json();

    setUploadingPhoto(false);

    if (!res.ok) {
      setMessage(data.message || "Photo upload failed.");
      return;
    }

    setField("photo", data.url);

    // Refresh the session so the navbar avatar updates instantly (no re-login)
    await update({ image: data.url });

    setMessage("Profile photo updated.");
  }

  async function handleAssetUpload(e, field) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAsset(field);
    setMessage("");

    const uploadData = new FormData();
    uploadData.append("file", file);

    const res = await fetch("/api/portal/profile/upload", {
      method: "POST",
      body: uploadData,
    });

    const data = await res.json();
    setUploadingAsset(null);

    if (!res.ok) {
      setMessage(data.message || "Upload failed.");
      return;
    }

    setField(field, data.url);
    setMessage(field === "logo" ? "Company logo uploaded." : "Banner uploaded.");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const res = await fetch("/api/portal/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setSaving(false);
    setMessage(data.message);

    if (res.ok) {
      await update({ image: form.photo || null, name: form.name });
      window.location.href = "/portal";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="portal-profile-form">
      <div className="portal-photo-upload">
        <div className="portal-photo-preview">
          {form.photo ? (
            <Image
              src={form.photo}
              alt="Profile photo"
              fill
              className="portal-photo-img"
            />
          ) : (
            <span>{form.name ? form.name.charAt(0).toUpperCase() : "M"}</span>
          )}
        </div>

        <div>
          <label className="portal-photo-label">Profile Photo</label>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={uploadingPhoto}
          />

          {uploadingPhoto && <p>Uploading photo...</p>}
        </div>
      </div>

      <input
        type="text"
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setField("name", e.target.value)}
      />

      <input
        type="text"
        placeholder="Organization / Company name"
        value={form.organization}
        onChange={(e) => setField("organization", e.target.value)}
      />

      <input
        type="text"
        placeholder="Position / Job title"
        value={form.position}
        onChange={(e) => setField("position", e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setField("phone", e.target.value)}
      />

      <textarea
        placeholder="Short biography"
        rows={5}
        value={form.bio}
        onChange={(e) => setField("bio", e.target.value)}
      />

      {/* ── Directory / company profile ───────────────────────────────── */}
      <div className="portal-profile-section">
        <h2 className="portal-profile-section-title">Directory Profile</h2>
        <p className="portal-profile-section-hint">
          This information appears in the Members Directory. Fields shown depend
          on your membership tier.
        </p>
      </div>

      <div className="portal-asset-upload">
        <div className="portal-asset-preview portal-asset-preview--logo">
          {form.logo ? (
            <Image src={form.logo} alt="Company logo" fill className="portal-asset-img" />
          ) : (
            <span>Logo</span>
          )}
        </div>
        <div>
          <label className="portal-photo-label">Company Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleAssetUpload(e, "logo")}
            disabled={uploadingAsset === "logo"}
          />
          {uploadingAsset === "logo" && <p>Uploading logo...</p>}
        </div>
      </div>

      <select
        value={form.industrySector}
        onChange={(e) => setField("industrySector", e.target.value)}
      >
        <option value="">Select industry sector…</option>
        {INDUSTRY_SECTORS.map((sector) => (
          <option key={sector} value={sector}>
            {sector}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Industry tags (e.g. Banking, Private Equity)"
        value={form.industryTags}
        onChange={(e) => setField("industryTags", e.target.value)}
      />

      <textarea
        placeholder="Company description (Presidential 150–250, Patron 100–150, Corporate 50–100 words)"
        rows={6}
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
        rows={4}
        value={form.featuredProjects}
        onChange={(e) => setField("featuredProjects", e.target.value)}
      />

      <div className="portal-asset-upload">
        <div className="portal-asset-preview portal-asset-preview--banner">
          {form.bannerImage ? (
            <Image src={form.bannerImage} alt="Banner" fill className="portal-asset-img" />
          ) : (
            <span>Banner (Presidential Circle)</span>
          )}
        </div>
        <div>
          <label className="portal-photo-label">Featured Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleAssetUpload(e, "bannerImage")}
            disabled={uploadingAsset === "bannerImage"}
          />
          {uploadingAsset === "bannerImage" && <p>Uploading banner...</p>}
        </div>
      </div>

      <label className="portal-profile-checkbox">
        <input
          type="checkbox"
          checked={form.directoryVisible}
          onChange={(e) => setField("directoryVisible", e.target.checked)}
        />
        <span>Show my profile in the Members Directory</span>
      </label>

      <button type="submit" disabled={saving || uploadingPhoto || uploadingAsset}>
        {saving ? "Saving..." : "Save Profile"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
