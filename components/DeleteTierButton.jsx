"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteTierButton({ tierId, tierTitle }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete the "${tierTitle}" tier?\n\nThis permanently removes it. Tiers that members or payments use cannot be deleted — deactivate them instead.`
    );
    if (!confirmed) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/memberships/${tierId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Could not delete tier.");
        setDeleting(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Could not delete tier.");
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="admin-membership-delete-btn"
    >
      {deleting ? "Deleting…" : "Delete"}
      <Trash2 size={14} />
    </button>
  );
}
