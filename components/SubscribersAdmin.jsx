"use client";

import { useState } from "react";
import { Download, Mail } from "lucide-react";

export default function SubscribersAdmin({ subscribers }) {
  const [downloading, setDownloading] = useState(false);

  function downloadCsv() {
    setDownloading(true);

    const headers = ["Email", "Subscribed At"];
    const rows = subscribers.map((s) => [
      s.email,
      new Date(s.createdAt).toLocaleString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "abgcc-subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloading(false);
  }

  if (!subscribers.length) {
    return <p className="admin-subs-empty">No subscribers yet.</p>;
  }

  return (
    <div className="admin-subs">
      <div className="admin-subs-toolbar">
        <span>{subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}</span>
        <button type="button" onClick={downloadCsv} disabled={downloading}>
          <Download size={15} />
          {downloading ? "Preparing…" : "Download CSV"}
        </button>
      </div>

      <div className="admin-subs-list">
        {subscribers.map((s) => (
          <div key={s.id} className="admin-subs-item">
            <span className="admin-subs-email">
              <Mail size={15} />
              {s.email}
            </span>
            <span className="admin-subs-date">
              {new Date(s.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
