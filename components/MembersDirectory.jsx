"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Search, X, ExternalLink, Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/MotionReveal";
import { INDUSTRY_SECTORS } from "@/lib/directory/industries";

import "@/styles/members.css";

function normalizeUrl(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function subtitleFor(member) {
  const parts = [];
  if (member.organization && member.name) parts.push(member.name);
  if (member.position) parts.push(member.position);
  return parts.join(" · ");
}

function snippet(text, max = 160) {
  if (!text) return "";
  const clean = text.trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

function MemberBadge({ member }) {
  return (
    <span className="member-badge" style={{ "--badge-color": member.tierColor }}>
      {member.tierLabel}
    </span>
  );
}

function MemberAvatar({ member, sizes }) {
  const src = member.logo || member.photo;
  if (src) {
    return (
      <Image
        src={src}
        alt={member.organization || member.name}
        fill
        sizes={sizes}
        className="member-avatar-img"
      />
    );
  }
  const initial = (member.organization || member.name || "M")
    .charAt(0)
    .toUpperCase();
  return <span>{initial}</span>;
}

function MemberCard({ member, onOpen }) {
  const subtitle = subtitleFor(member);
  return (
    <article
      className="member-card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(member)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(member);
        }
      }}
    >
      <div className="member-avatar">
        <MemberAvatar member={member} sizes="72px" />
      </div>

      <div className="member-info">
        <h3 className="member-name">{member.organization || member.name}</h3>
        {subtitle && <p className="member-role">{subtitle}</p>}
        <MemberBadge member={member} />
      </div>
    </article>
  );
}

function FeaturedCard({ member, onOpen }) {
  const media = member.bannerImage || member.logo;
  return (
    <article
      className="member-featured"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(member)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(member);
        }
      }}
    >
      <div className="member-featured-media">
        {media ? (
          <Image
            src={media}
            alt={member.organization || member.name}
            fill
            sizes="(max-width: 64em) 100vw, 33vw"
            className="member-featured-img"
          />
        ) : (
          <span className="member-featured-placeholder">
            {(member.organization || member.name || "M").charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="member-featured-body">
        <MemberBadge member={member} />
        <h3 className="member-featured-title">
          {member.organization || member.name}
        </h3>
        {member.companyDescription && (
          <p className="member-featured-desc">
            {snippet(member.companyDescription, 180)}
          </p>
        )}
      </div>
    </article>
  );
}

function MemberModal({ member, onClose }) {
  const subtitle = subtitleFor(member);
  const website = normalizeUrl(member.website);
  const tags = member.industryTags
    ? member.industryTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="member-modal-overlay" onClick={onClose}>
      <div
        className="member-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${member.organization || member.name} profile`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="member-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {member.bannerImage && (
          <div className="member-modal-banner">
            <Image
              src={member.bannerImage}
              alt=""
              fill
              sizes="(max-width: 48em) 100vw, 40rem"
              className="member-modal-banner-img"
            />
          </div>
        )}

        <div className="member-modal-body">
          <div className="member-modal-head">
            <div className="member-modal-logo">
              <MemberAvatar member={member} sizes="80px" />
            </div>
            <div className="member-modal-headtext">
              <h2 className="member-modal-title">
                {member.organization || member.name}
              </h2>
              {subtitle && <p className="member-modal-subtitle">{subtitle}</p>}
              <MemberBadge member={member} />
            </div>
          </div>

          <p className="member-modal-sector">{member.industrySector}</p>

          {tags.length > 0 && (
            <div className="member-modal-tags">
              {tags.map((t) => (
                <span key={t} className="member-modal-tag">
                  {t}
                </span>
              ))}
            </div>
          )}

          {member.companyDescription && (
            <p className="member-modal-desc">{member.companyDescription}</p>
          )}

          {member.featuredProjects && (
            <div className="member-modal-block">
              <h4>Featured Projects / News</h4>
              <p>{member.featuredProjects}</p>
            </div>
          )}

          {(member.keyContactName || member.keyContactEmail) && (
            <div className="member-modal-block">
              <h4>Key Contact</h4>
              <p>
                {member.keyContactName}
                {member.keyContactName && member.keyContactTitle ? " · " : ""}
                {member.keyContactTitle}
              </p>
              {member.keyContactEmail && (
                <a
                  className="member-modal-link"
                  href={`mailto:${member.keyContactEmail}`}
                >
                  <Mail size={15} /> {member.keyContactEmail}
                </a>
              )}
            </div>
          )}

          {member.address && (
            <p className="member-modal-meta">
              <MapPin size={15} /> {member.address}
            </p>
          )}

          {website && (
            <a
              className="member-modal-website"
              href={website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit website <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MembersDirectory({ members }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState(""); // "" = all sectors
  const [active, setActive] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (sector && m.industrySector !== sector) return false;
      if (!q) return true;
      return `${m.name} ${m.organization}`.toLowerCase().includes(q);
    });
  }, [members, query, sector]);

  const presidential = useMemo(
    () => filtered.filter((m) => m.tierKey === "presidential"),
    [filtered]
  );

  const groups = useMemo(() => {
    const order = sector ? [sector] : INDUSTRY_SECTORS;
    return order
      .map((s) => ({
        sector: s,
        items: filtered
          .filter((m) => m.industrySector === s)
          .sort(
            (a, b) => a.tierRank - b.tierRank || a.name.localeCompare(b.name)
          ),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered, sector]);

  const availableSectors = useMemo(() => {
    const set = new Set(members.map((m) => m.industrySector));
    return INDUSTRY_SECTORS.filter((s) => set.has(s));
  }, [members]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <main className="members-page">
      <section className="members-hero">
        <div className="page-container">
          <Reveal>
            <p className="section-label">Members Directory</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="members-hero-title">The ABGCC member network.</h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="members-hero-text">
              Meet the business leaders, investors, and organizations that make
              up the American Balkan Global Chamber of Commerce — organized by
              industry.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="members-controls">
              <div className="members-search">
                <Search size={18} className="members-search-icon" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by company or name…"
                  aria-label="Search members"
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

              <select
                className="members-sector-filter"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                aria-label="Filter by industry sector"
              >
                <option value="">All industries</option>
                {availableSectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <p className="members-count">
              {filtered.length} {filtered.length === 1 ? "member" : "members"}
              {sector ? ` in ${sector}` : ""}
              {query ? ` matching “${query}”` : ""}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="members-list-section">
        <div className="page-container">
          {filtered.length === 0 ? (
            <div className="members-empty">
              <h2>No members found</h2>
              <p>
                {query || sector
                  ? "No members match your search. Try a different name or industry."
                  : "There are no active members to display yet."}
              </p>
            </div>
          ) : (
            <>
              {!sector && presidential.length > 0 && (
                <div className="members-featured-section">
                  <h2 className="members-sector-title members-featured-heading">
                    Presidential Circle
                  </h2>
                  <div className="members-featured-grid">
                    {presidential.map((m) => (
                      <FeaturedCard key={m.id} member={m} onOpen={setActive} />
                    ))}
                  </div>
                </div>
              )}

              {groups.map((g) => (
                <div key={g.sector} className="members-sector">
                  <h2 className="members-sector-title">{g.sector}</h2>
                  <div className="members-grid">
                    {g.items.map((m) => (
                      <MemberCard key={m.id} member={m} onOpen={setActive} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {active && <MemberModal member={active} onClose={() => setActive(null)} />}
    </main>
  );
}
