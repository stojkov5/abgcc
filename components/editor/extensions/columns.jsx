"use client";

import { useCallback } from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";

const MIN_WIDTH = 12; // smallest column width, in %

// React node view for a single column — renders the editable content plus a
// drag handle on its right edge that resizes this column and its neighbour.
function ColumnView({ node, getPos, editor }) {
  const width = node.attrs.width;

  let isLast = false;
  try {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (typeof pos === "number") {
      const $pos = editor.state.doc.resolve(pos);
      isLast = $pos.index() === $pos.parent.childCount - 1;
    }
  } catch {
    isLast = false;
  }

  const startResize = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const pos = typeof getPos === "function" ? getPos() : null;
      if (typeof pos !== "number") return;

      const colDom = editor.view.nodeDOM(pos);
      const blockDom = colDom?.parentElement;
      const nextDom = colDom?.nextElementSibling;
      if (!blockDom || !nextDom) return;

      const colNode = editor.state.doc.nodeAt(pos);
      if (!colNode) return;
      const nextPos = pos + colNode.nodeSize;
      const nextNode = editor.state.doc.nodeAt(nextPos);
      if (!nextNode || nextNode.type.name !== "column") return;

      const blockWidth = blockDom.getBoundingClientRect().width || 1;
      const startX = event.clientX;
      const startThis =
        colNode.attrs.width ??
        (colDom.getBoundingClientRect().width / blockWidth) * 100;
      const startNext =
        nextNode.attrs.width ??
        (nextDom.getBoundingClientRect().width / blockWidth) * 100;

      const onMove = (e) => {
        const deltaPct = ((e.clientX - startX) / blockWidth) * 100;
        let a = startThis + deltaPct;
        let b = startNext - deltaPct;
        if (a < MIN_WIDTH) {
          b -= MIN_WIDTH - a;
          a = MIN_WIDTH;
        }
        if (b < MIN_WIDTH) {
          a -= MIN_WIDTH - b;
          b = MIN_WIDTH;
        }
        const tr = editor.state.tr;
        tr.setNodeAttribute(pos, "width", Math.round(a));
        tr.setNodeAttribute(nextPos, "width", Math.round(b));
        tr.setMeta("addToHistory", false);
        editor.view.dispatch(tr);
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.classList.remove("rt-resizing");
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.body.classList.add("rt-resizing");
    },
    [editor, getPos]
  );

  return (
    <NodeViewWrapper
      className="rt-column"
      style={{ flex: width != null ? `0 0 ${width}%` : "1 1 0", minWidth: 0 }}
    >
      <NodeViewContent className="rt-column-content" />
      {!isLast && (
        <span
          className="rt-column-resizer"
          contentEditable={false}
          onMouseDown={startResize}
          aria-hidden="true"
        />
      )}
    </NodeViewWrapper>
  );
}

export const Column = Node.create({
  name: "column",
  content: "block+",
  isolating: true,

  addAttributes() {
    return {
      width: {
        default: null,
        // Recover the width (%) from the inline flex-basis on load.
        parseHTML: (element) => {
          const match = (element.getAttribute("style") || "").match(
            /flex:\s*0\s+0\s+([\d.]+)%/
          );
          return match ? Number(match[1]) : null;
        },
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const width = node.attrs.width;
    const style =
      width != null
        ? `flex:0 0 ${width}%;min-width:0`
        : "flex:1 1 0;min-width:0";
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "column",
        class: "rt-column",
        style,
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnView);
  },
});

export const ColumnBlock = Node.create({
  name: "columnBlock",
  group: "block",
  content: "column+",
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "columns",
        class: "rt-columns",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertColumns:
        (count = 2) =>
        ({ commands }) => {
          const n = Math.max(2, Math.min(4, count));
          const width = Math.round(100 / n);
          const columns = Array.from({ length: n }, () => ({
            type: "column",
            attrs: { width },
            content: [{ type: "paragraph" }],
          }));
          return commands.insertContent({
            type: "columnBlock",
            content: columns,
          });
        },
    };
  },
});
