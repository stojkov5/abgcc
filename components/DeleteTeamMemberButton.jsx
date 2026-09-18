"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteTeamMemberButton({ memberId, memberName }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${memberName}"?\n\nThis permanently removes the card from the About page. This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/team/${memberId}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Could not delete team member.");
        setDeleting(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Could not delete team member.");
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="admin-events-table-delete"
    >
      {deleting ? "Deleting…" : "Delete"}
      <Trash2 size={14} />
    </button>
  );
}
