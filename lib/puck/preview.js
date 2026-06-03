// Utilities for working with Puck-based event content.
//
// This module is intentionally plain JS (no React, no client-only APIs) so it
// can be imported from both Server Components (event pages) and Client
// Components (the editor).
//
// Event `description` can be one of two shapes:
//   1. Puck JSON  (new events)   -> stringified { content, root, zones? }
//   2. Legacy HTML/plain text    (events created before Puck)
// Detection is based on whether the string parses into a Puck data object.

/**
 * Returns the parsed Puck data object, or null when the value is legacy
 * HTML/plain text (or empty).
 */
export function parsePuckData(value) {
  if (value && typeof value === "object" && Array.isArray(value.content)) {
    return value;
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed.startsWith("{")) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.content)) {
      return parsed;
    }
  } catch {
    // Not JSON — treat as legacy HTML/text.
  }

  return null;
}

export function isPuckData(value) {
  return parsePuckData(value) !== null;
}

function stripTags(input) {
  return String(input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectText(node, out) {
  if (!node) return;

  if (Array.isArray(node)) {
    for (const child of node) collectText(child, out);
    return;
  }

  if (typeof node === "object") {
    const props = node.props || {};

    for (const key of ["title", "text", "label", "caption", "html"]) {
      if (typeof props[key] === "string") out.push(stripTags(props[key]));
    }

    // Recurse into slot content nested inside props (e.g. Columns).
    for (const value of Object.values(props)) {
      if (Array.isArray(value)) collectText(value, out);
    }
  }
}

/**
 * Plain-text preview used for event cards / meta. Works for both Puck JSON
 * (walks the block tree) and legacy HTML (strips tags).
 */
export function getEventPreview(value, maxLength = 160) {
  const data = parsePuckData(value);

  if (data) {
    const parts = [];
    collectText(data.content, parts);
    return parts.join(" ").slice(0, maxLength);
  }

  return stripTags(value).slice(0, maxLength);
}

// Generic alias — the preview logic is content-agnostic (events, posts, …).
export const getContentPreview = getEventPreview;

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Builds the data object the Puck editor should start from on mount:
 *   - Puck JSON               -> used as-is
 *   - Legacy HTML/text (set)  -> wrapped in a single RawHtml block (nothing lost)
 *   - Empty                   -> blank canvas
 */
export function toEditorData(value) {
  const data = parsePuckData(value);

  if (data) {
    return {
      content: data.content || [],
      root: data.root || {},
      ...(data.zones ? { zones: data.zones } : {}),
    };
  }

  const legacy = typeof value === "string" ? value.trim() : "";

  if (legacy) {
    return {
      content: [
        {
          type: "RawHtml",
          props: { id: randomId("RawHtml"), html: legacy },
        },
      ],
      root: {},
    };
  }

  return { content: [], root: {} };
}
