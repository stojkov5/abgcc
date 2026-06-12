"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Reveal } from "@/components/MotionReveal";

import "@/styles/members.css";

export default function MembersDirectory({ members }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;

    // Match when the full name — or any word in it — starts with the query,
    // so typing a letter shows everyone whose name begins with it.
    return members.filter((m) => {
      const name = m.name.toLowerCase();
      if (name.startsWith(q)) return true;
      return name.split(/\s+/).some((word) => word.startsWith(q));
    });
  }, [members, query]);

  return (
    <main className="members-page">
      <section className="members-hero">
        <div className="page-container">
          <Reveal>
            <p className="section-label">Members Directory</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="members-hero-title">
              The ABGCC member network.
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="members-hero-text">
              Meet the business leaders, investors, and organizations that make
              up the American Balkan Global Chamber of Commerce.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="members-search">
              <Search size={18} className="members-search-icon" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members by name…"
                aria-label="Search members by name"
              />
              {query && (
                <button
                  type="button"
                  className="members-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <p className="members-count">
              {filtered.length}{" "}
              {filtered.length === 1 ? "member" : "members"}
              {query ? ` matching “${query}”` : ""}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="members-list-section">
        <div className="page-container">
          {filtered.length > 0 ? (
            <div className="members-grid">
              {filtered.map((m) => (
                <article className="member-card" key={m.id}>
                  <div className="member-avatar">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        sizes="72px"
                        className="member-avatar-img"
                      />
                    ) : (
                      <span>{m.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="member-info">
                    <h3 className="member-name">{m.name}</h3>
                    {(m.position || m.organization) && (
                      <p className="member-role">
                        {m.position}
                        {m.position && m.organization ? " · " : ""}
                        {m.organization}
                      </p>
                    )}
                    <span className="member-tier">{m.tier}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="members-empty">
              <h2>No members found</h2>
              <p>
                {query
                  ? `No members match “${query}”. Try a different name.`
                  : "There are no active members to display yet."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
