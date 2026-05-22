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
        prev.map((item) => (item.id === id ? { ...item, read } : item))
      );
    }
  }

  async function deleteMessage(id) {
    const confirmDelete = window.confirm("Delete this contact message?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/admin/contact-messages/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <main className="admin-page min-h-screen bg-[#f7fbff] px-4 py-28 text-[#10243f]">
      <section className="mx-auto w-full max-w-7xl">
        <div className="mb-10">
          <p className="mb-4 inline-flex rounded-full bg-[#c8a76a] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#10243f]">
            Admin Panel
          </p>

          <h1 className="max-w-4xl text-4xl font-black leading-none tracking-[-0.055em] md:text-6xl">
            Contact Messages
          </h1>

          <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#10243f]/70">
            Review incoming inquiries, partnerships, membership requests, and
            business communication submitted through the website.
          </p>

          {message && (
            <p className="mt-5 rounded-2xl border border-[#64b5f6]/20 bg-white/70 px-5 py-3 text-sm font-bold text-[#10243f]/70 shadow-sm">
              {message}
            </p>
          )}
        </div>

        <div className="grid gap-5">
          {items.map((item) => {
            const isExpanded = !!expanded[item.id];
            const isLong = item.message?.length > 180;

            return (
              <article
                key={item.id}
                className={`overflow-hidden rounded-[2rem] border p-6 shadow-[0_1.5rem_4rem_rgba(46,111,160,0.14)] backdrop-blur-md transition hover:-translate-y-1 ${
                  item.read
                    ? "border-[#64b5f6]/20 bg-white/75"
                    : "border-[#c8a76a]/50 bg-[#fff7e6]/85"
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                          item.read
                            ? "bg-[#10243f]/10 text-[#10243f]/60"
                            : "bg-[#c8a76a] text-[#10243f]"
                        }`}
                      >
                        {item.read ? "Read" : "Unread"}
                      </span>

                      <span className="inline-flex items-center gap-2 text-sm font-bold text-[#10243f]/50">
                        <CalendarDays size={15} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black leading-tight tracking-[-0.035em] md:text-3xl">
                      {item.subject}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-bold text-[#10243f]/60">
                      <span>{item.name}</span>
                      <span className="h-1 w-1 rounded-full bg-[#10243f]/30" />
                      <span className="inline-flex items-center gap-2">
                        <Mail size={15} />
                        {item.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => toggleRead(item.id, !item.read)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10243f] px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#18385f]"
                    >
                      {item.read ? <EyeOff size={16} /> : <Eye size={16} />}
                      {item.read ? "Mark Unread" : "Mark Read"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteMessage(item.id)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-400/40 bg-red-50 px-5 text-sm font-black text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-[#64b5f6]/20 bg-white/65 p-5">
                  <p
                    className={`whitespace-pre-line text-[0.98rem] font-semibold leading-8 text-[#10243f]/75 ${
                      isExpanded ? "" : "line-clamp-3"
                    }`}
                  >
                    {item.message}
                  </p>

                  {isLong && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#10243f]/10 px-4 py-2 text-sm font-black text-[#10243f] transition hover:bg-[#10243f]/15"
                    >
                      {isExpanded ? (
                        <>
                          Show Less <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Read Full Message <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          {items.length === 0 && (
            <div className="rounded-[2rem] border border-[#64b5f6]/20 bg-white/75 p-10 text-center shadow-[0_1.5rem_4rem_rgba(46,111,160,0.14)]">
              <h2 className="text-3xl font-black tracking-[-0.04em]">
                No contact messages yet.
              </h2>
              <p className="mt-3 font-semibold text-[#10243f]/60">
                New website inquiries will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}