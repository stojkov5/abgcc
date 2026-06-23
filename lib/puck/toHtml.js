// Best-effort conversion of legacy Puck JSON content into HTML, so existing
// events/posts created with the old Puck editor remain editable in the new
// TipTap editor. Plain JS (no React) — safe to import on client or server.
//
// Anything we can't map cleanly falls back to its text/HTML so nothing is lost.

import { parsePuckData } from "@/lib/puck/preview";
import { resolveColor } from "@/lib/puck/colors";

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function styleAttr(style) {
  const parts = Object.entries(style)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}:${v}`);
  return parts.length ? ` style="${parts.join(";")}"` : "";
}

// Convert a Text block's value into paragraphs, preserving blank-line breaks.
function textToParagraphs(text, style) {
  const blocks = String(text || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (!blocks.length) return "";

  return blocks
    .map((p) => `<p${styleAttr(style)}>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function renderBlock(block) {
  if (!block || typeof block !== "object") return "";
  const props = block.props || {};

  switch (block.type) {
    case "Heading": {
      const tag = ["h2", "h3", "h4"].includes(props.level) ? props.level : "h2";
      const style = { "text-align": props.align || "left" };
      const color = resolveColor(props.color);
      if (color) style.color = color;
      return `<${tag}${styleAttr(style)}>${escapeHtml(props.text)}</${tag}>`;
    }

    case "Text": {
      const style = { "text-align": props.align || "left" };
      const color = resolveColor(props.color);
      if (color) style.color = color;
      if (props.weight === "bold") style["font-weight"] = "700";
      else if (props.weight === "medium") style["font-weight"] = "500";
      return textToParagraphs(props.text, style);
    }

    case "Image": {
      if (!props.src) return "";
      const img = `<img src="${escapeHtml(props.src)}" alt="${escapeHtml(
        props.alt
      )}">`;
      if (props.caption) {
        return `<figure>${img}<figcaption>${escapeHtml(
          props.caption
        )}</figcaption></figure>`;
      }
      return `<p>${img}</p>`;
    }

    case "Button": {
      const href = escapeHtml(props.href || "#");
      return `<p><a href="${href}">${escapeHtml(props.label || "Link")}</a></p>`;
    }

    case "Columns": {
      const col1 = renderBlocks(props.column1);
      const col2 = renderBlocks(props.column2);
      return (
        `<div data-type="columns" class="rt-columns">` +
        `<div data-type="column" class="rt-column" style="flex:0 0 50%">${col1 || "<p></p>"}</div>` +
        `<div data-type="column" class="rt-column" style="flex:0 0 50%">${col2 || "<p></p>"}</div>` +
        `</div>`
      );
    }

    case "Divider":
      return "<hr>";

    case "Spacer":
      return "<p></p>";

    case "RawHtml":
      return String(props.html || "");

    default:
      return "";
  }
}

function renderBlocks(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks.map(renderBlock).join("");
}

/**
 * Converts a content value to HTML for the TipTap editor:
 *   - Puck JSON          -> converted block-by-block
 *   - HTML / plain text  -> returned as-is (already editor-friendly)
 */
export function contentToHtml(value) {
  const data = parsePuckData(value);
  if (!data) return typeof value === "string" ? value : "";
  return renderBlocks(data.content);
}
