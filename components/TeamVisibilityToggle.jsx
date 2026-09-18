"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

// Show/Hide toggle for a team member, used in the admin list. Flips the
// `visible` flag that controls whether the card appears on the About page.
export default function TeamVisibilityToggle({ memberId, visible }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);

    try {
      const res = await fetch(`/api/admin/team/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !visible }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Could not update visibility.");
        setBusy(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Could not update visibility.");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className="admin-events-table-link"
      title={visible ? "Hide from About page" : "Show on About page"}
    >
      {visible ? <Eye size={14} /> : <EyeOff size={14} />}
      {busy ? "…" : visible ? "Hide" : "Show"}
    </button>
  );
}
