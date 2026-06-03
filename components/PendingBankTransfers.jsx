"use client";

import { useState } from "react";
import { Landmark, Check, X } from "lucide-react";

export default function PendingBankTransfers({ requests }) {
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  async function confirm(id) {
    if (!window.confirm("Confirm that payment has been received for this membership?")) return;
    setBusyId(id);
    setMessage("");

    const res = await fetch(`/api/admin/memberships/${id}/confirm`, {
      method: "POST",
    });
    const data = await res.json();
    setMessage(data.message);

    if (res.ok) window.location.reload();
    else setBusyId("");
  }

  async function cancel(id) {
    if (!window.confirm("Cancel this bank-transfer request?")) return;
    setBusyId(id);
    setMessage("");

    const res = await fetch(`/api/admin/user-memberships/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    const data = await res.json();
    setMessage(data.message);

    if (res.ok) window.location.reload();
    else setBusyId("");
  }

  if (!requests || requests.length === 0) {
    return (
      <p className="admin-bt-empty">No pending bank-transfer requests.</p>
    );
  }

  return (
    <div className="admin-bt-list">
      {requests.map((req) => (
        <div key={req.id} className="admin-bt-card">
          <div className="admin-bt-icon">
            <Landmark size={18} />
          </div>

          <div className="admin-bt-main">
            <h3>{req.userName || req.userEmail}</h3>
            <p className="admin-bt-email">{req.userEmail}</p>

            <div className="admin-bt-meta">
              <span>{req.tierTitle}</span>
              <span className="admin-bt-amount">${req.amount}</span>
              <span className="admin-bt-ref">{req.reference}</span>
            </div>

            <p className="admin-bt-date">
              Requested {new Date(req.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="admin-bt-actions">
            <button
              type="button"
              className="admin-bt-confirm"
              onClick={() => confirm(req.id)}
              disabled={busyId === req.id}
            >
              <Check size={15} />
              {busyId === req.id ? "Working..." : "Confirm Payment"}
            </button>

            <button
              type="button"
              className="admin-bt-cancel"
              onClick={() => cancel(req.id)}
              disabled={busyId === req.id}
            >
              <X size={15} />
              Cancel
            </button>
          </div>
        </div>
      ))}

      {message && <p className="admin-form-message">{message}</p>}
    </div>
  );
}
