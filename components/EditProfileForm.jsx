"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function EditProfileForm({ user }) {
  const { update } = useSession();

  const [form, setForm] = useState({
    name: user.name || "",
    organization: user.organization || "",
    position: user.position || "",
    phone: user.phone || "",
    bio: user.bio || "",
    photo: user.photo || "",
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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

    setForm({
      ...form,
      photo: data.url,
    });

    // Refresh the session so the navbar avatar updates instantly (no re-login)
    await update({ image: data.url });

    setMessage("Profile photo updated.");
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
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Organization"
        value={form.organization}
        onChange={(e) =>
          setForm({
            ...form,
            organization: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Position / Job title"
        value={form.position}
        onChange={(e) =>
          setForm({
            ...form,
            position: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) =>
          setForm({
            ...form,
            phone: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Short biography"
        rows={5}
        value={form.bio}
        onChange={(e) =>
          setForm({
            ...form,
            bio: e.target.value,
          })
        }
      />

      <button type="submit" disabled={saving || uploadingPhoto}>
        {saving ? "Saving..." : "Save Profile"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}