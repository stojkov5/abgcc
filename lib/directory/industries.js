// Shared constants for the Members Directory — used by the public directory
// (grouping + filtering), the portal profile form (dropdown), and admin editing.
// Pure data (no server imports) so it's safe to import in client components.

import { TIERS } from "@/lib/membership/tiers";

// The 13 fixed industry sectors, in the order the directory groups them.
export const INDUSTRY_SECTORS = [
  "Real Estate, Construction & Infrastructure",
  "Energy & Utilities",
  "Technology, AI & Data Centers",
  "Telecommunications & Connectivity",
  "Financial, Legal & Professional Services",
  "Healthcare, Life Sciences & Medical Tourism",
  "Education & Research",
  "Hospitality, Travel & Tourism",
  "Food & Beverage",
  "Manufacturing, Industrial & Logistics",
  "Government, Trade Associations & Nonprofits",
  "Media, Marketing & Creative Industries",
  "Other",
];

// Members without a recognised sector are grouped here.
export const FALLBACK_SECTOR = "Other";

// Tier badge label + color + sort rank (lower rank shows first within a sector).
// NOTE: the "professional" tier ($850) is labelled "Business Member" per the
// directory doc; the membership page calls it "Professional". TODO: confirm the
// final wording with the client.
export const TIER_BADGES = {
  presidential: { label: "Presidential Circle", color: "#C9A227", rank: 0 },
  patron: { label: "Patron Member", color: "#0047AB", rank: 1 },
  corporate: { label: "Corporate Member", color: "#C0392B", rank: 2 },
  professional: { label: "Business Member", color: "#2E8B57", rank: 3 },
  individual: { label: "Individual Member", color: "#A7A9AC", rank: 4 },
};

export const DEFAULT_BADGE = { label: "Member", color: "#A7A9AC", rank: 5 };

// Resolve a DB tier title (e.g. "Professional", "Business") to a tier key,
// reusing the aliases defined in lib/membership/tiers.js.
export function tierKeyFromTitle(title) {
  if (!title) return null;
  const needle = title.trim().toLowerCase();

  for (const tier of TIERS) {
    if (tier.key === needle) return tier.key;
    if (tier.title.toLowerCase() === needle) return tier.key;
    if (tier.aliases?.some((alias) => alias.toLowerCase() === needle)) {
      return tier.key;
    }
  }

  return null;
}

// Badge descriptor for a DB tier title (falls back to a neutral "Member" badge).
export function badgeForTitle(title) {
  const key = tierKeyFromTitle(title);
  return (key && TIER_BADGES[key]) || DEFAULT_BADGE;
}

// Sort rank for a DB tier title (used to order members within a sector).
export function tierRankFromTitle(title) {
  return badgeForTitle(title).rank;
}
