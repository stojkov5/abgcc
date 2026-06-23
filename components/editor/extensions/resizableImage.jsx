"use client";

import { useRef } from "react";
import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const MIN_WIDTH = 60; // px

function ImageView({ node, getPos, editor, selected }) {
  const imgRef = useRef(null);
  const { src, alt, title, width } = node.attrs;

  function startResize(event, direction) {
    if (!editor.isEditable) return;
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startWidth =
      imgRef.current?.getBoundingClientRect().width || width || 0;

    const pos = typeof getPos === "function" ? getPos() : null;

    let latest = startWidth;

    const onMove = (e) => {
      const delta = e.clientX - startX;
      const next = direction === "left" ? startWidth - delta : startWidth + delta;
      latest = Math.max(MIN_WIDTH, Math.round(next));

      // Live preview without flooding the undo history.
      if (typeof pos === "number") {
        const tr = editor.state.tr;
        tr.setNodeAttribute(pos, "width", latest);
        tr.setMeta("addToHistory", false);
        editor.view.dispatch(tr);
      }
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.classList.remove("rt-resizing");
      // Commit a single history entry for the final size.
      editor.chain().focus().updateAttributes("image", { width: latest }).run();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.classList.add("rt-resizing");
  }

  return (
    <NodeViewWrapper
      className="rt-image-wrap"
      data-selected={selected ? "" : undefined}
      style={{ width: width ? `${width}px` : undefined }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt || ""}
        title={title || undefined}
        className="rt-image"
        draggable={false}
      />
      {editor.isEditable && (
        <>
          <span
            className="rt-image-handle rt-image-handle--br"
            onMouseDown={(e) => startResize(e, "right")}
            aria-hidden="true"
          />
          <span
            className="rt-image-handle rt-image-handle--bl"
            onMouseDown={(e) => startResize(e, "left")}
            aria-hidden="true"
          />
        </>
      )}
    </NodeViewWrapper>
  );
}

// Image node with a draggable width, persisted as an inline style so published
// pages render at the chosen size (and stay capped to the container via CSS).
export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const fromStyle = element.style?.width || "";
          const match = fromStyle.match(/([\d.]+)px/);
          if (match) return Number(match[1]);
          const attr = element.getAttribute("width");
          return attr ? Number(attr) : null;
        },
        renderHTML: (attributes) =>
          attributes.width ? { style: `width: ${attributes.width}px` } : {},
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

export default ResizableImage;
