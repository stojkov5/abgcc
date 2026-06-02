"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteEventButton({ eventId, eventTitle }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${eventTitle}"?\n\nThis permanently removes the event and all of its registrations. This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Could not delete event.");
        setDeleting(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Could not delete event.");
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
