"use client";

import { useState } from "react";

import {
  Mail,
  Trash2,
  Eye,
  EyeOff,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import AdminShell from "@/components/AdminShell";

import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminStatus,
} from "@/components/admin/AdminUI";

import "@/styles/admin-contact.css";

export default function ContactMessagesAdmin({ messages }) {
  const [items, setItems] = useState(messages);
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState({});

  function toggleExpand(id) {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  async function toggleRead(id, read) {
    const res = await fetch(`/api/admin/contact-messages/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read }),
    });

    const data = await res.json();

    setMessage(data.message);

    if (res.ok) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, read } : item
        )
      );
    }
  }

  async function deleteMessage(id) {
    const confirmDelete = window.confirm(
      "Delete this contact message?"
    );

    if (!confirmDelete) return;

    const res = await fetch(
      `/api/admin/contact-messages/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    setMessage(data.message);

    if (res.ok) {
      setItems((prev) =>
        prev.filter((item) => item.id !== id)
      );
    }
  }

  return (
    <AdminShell>
      <div className="admin-contact-page">
        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Contact Messages"
          text="Review incoming inquiries, partnerships, membership requests, and business communication submitted through the website."
        />

        {message && (
          <div className="admin-contact-alert">
            {message}
          </div>
        )}

        <div className="admin-contact-grid">
          {items.map((item) => {
            const isExpanded = !!expanded[item.id];

            const isLong =
              item.message?.length > 180;

            return (
              <AdminPanel
                key={item.id}
                className={`admin-contact-card ${
                  item.read
                    ? "read"
                    : "unread"
                }`}
              >
                <div className="admin-contact-top">
                  <div>
                    <div className="admin-contact-meta-top">
                      <AdminStatus
                        variant={
                          item.read
                            ? "neutral"
                            : "warning"
                        }
                      >
                        {item.read
                          ? "Read"
                          : "Unread"}
                      </AdminStatus>

                      <span className="admin-contact-date">
                        <CalendarDays size={15} />

                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h2>{item.subject}</h2>

                    <div className="admin-contact-meta">
                      <span>{item.name}</span>

                      <span className="dot" />

                      <span>
                        <Mail size={15} />
                        {item.email}
                      </span>
                    </div>
                  </div>

                  <div className="admin-contact-actions">
                    <button
                      type="button"
                      onClick={() =>
                        toggleRead(
                          item.id,
                          !item.read
                        )
                      }
                      className="admin-contact-btn primary"
                    >
                      {item.read ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}

                      {item.read
                        ? "Mark Unread"
                        : "Mark Read"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteMessage(item.id)
                      }
                      className="admin-contact-btn danger"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="admin-contact-message">
                  <p
                    className={
                      isExpanded
                        ? ""
                        : "line-clamp-3"
                    }
                  >
                    {item.message}
                  </p>

                  {isLong && (
                    <button
                      type="button"
                      onClick={() =>
                        toggleExpand(item.id)
                      }
                      className="admin-contact-expand"
                    >
                      {isExpanded ? (
                        <>
                          Show Less
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Read Full Message
                          <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </AdminPanel>
            );
          })}

          {items.length === 0 && (
            <AdminEmptyState text="No contact messages yet." />
          )}
        </div>
      </div>
    </AdminShell>
  );
}