"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link2,
  Link2Off,
  Image as ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Minus,
  Columns2,
  Columns3,
  Undo2,
  Redo2,
  Upload,
} from "lucide-react";

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
];

const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "30", "36", "48"];

function Btn({ active, title, onClick, children }) {
  return (
    <button
      type="button"
      className={`rt-btn${active ? " is-active" : ""}`}
      title={title}
      aria-label={title}
      aria-pressed={active || undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function EditorToolbar({ editor }) {
  const fileRef = useRef(null);
  const [imgOpen, setImgOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const headingValue = editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
    ? "h3"
    : editor.isActive("heading", { level: 4 })
    ? "h4"
    : "p";

  const currentFont = editor.getAttributes("textStyle").fontFamily || "";
  const currentSize = (editor.getAttributes("textStyle").fontSize || "").replace(
    "px",
    ""
  );
  const currentColor = editor.getAttributes("textStyle").color || "#10243f";

  function setHeading(value) {
    const chain = editor.chain().focus();
    if (value === "p") chain.setParagraph().run();
    else chain.setHeading({ level: Number(value.slice(1)) }).run();
  }

  function setFont(value) {
    if (value) editor.chain().focus().setFontFamily(value).run();
    else editor.chain().focus().unsetFontFamily().run();
  }

  function setSize(value) {
    if (value) editor.chain().focus().setFontSize(`${value}px`).run();
    else editor.chain().focus().unsetFontSize().run();
  }

  function toggleLink() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const previous = editor.getAttributes("link").href || "";
    const url = window.prompt("Link URL", previous);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const href = /^https?:\/\/|^mailto:/i.test(url) ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  function insertImageUrl() {
    const url = imgUrl.trim();
    if (!url) return;
    const src = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    editor.chain().focus().setImage({ src }).run();
    setImgUrl("");
    setImgOpen(false);
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok && json.url) {
        editor.chain().focus().setImage({ src: json.url }).run();
        setImgOpen(false);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="rt-toolbar">
      <select
        className="rt-select"
        value={headingValue}
        onChange={(e) => setHeading(e.target.value)}
        title="Text style"
      >
        <option value="p">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>

      <select
        className="rt-select"
        value={currentFont}
        onChange={(e) => setFont(e.target.value)}
        title="Font"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        className="rt-select rt-select--sm"
        value={currentSize}
        onChange={(e) => setSize(e.target.value)}
        title="Font size"
      >
        <option value="">—</option>
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <span className="rt-divider" />

      <Btn
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Btn>
      <Btn
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Btn>
      <Btn
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </Btn>
      <Btn
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </Btn>
      <Btn
        title="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={16} />
      </Btn>

      <label className="rt-color" title="Text color">
        <span className="rt-color-swatch" style={{ background: currentColor }} />
        <input
          type="color"
          value={currentColor}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
      </label>

      <span className="rt-divider" />

      <Btn
        title={editor.isActive("link") ? "Remove link" : "Add link"}
        active={editor.isActive("link")}
        onClick={toggleLink}
      >
        {editor.isActive("link") ? <Link2Off size={16} /> : <Link2 size={16} />}
      </Btn>

      <div className="rt-popover-wrap">
        <Btn title="Insert image" onClick={() => setImgOpen((v) => !v)}>
          <ImageIcon size={16} />
        </Btn>
        {imgOpen && (
          <div className="rt-popover">
            <button
              type="button"
              className="rt-popover-upload"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <Upload size={15} />
              {uploading ? "Uploading…" : "Upload from computer"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFile}
            />
            <div className="rt-popover-or">or paste a URL</div>
            <div className="rt-popover-url">
              <input
                type="url"
                placeholder="https://…"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && insertImageUrl()}
              />
              <button type="button" onClick={insertImageUrl}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      <span className="rt-divider" />

      <Btn
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </Btn>
      <Btn
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </Btn>
      <Btn
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </Btn>

      <span className="rt-divider" />

      <Btn
        title="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={16} />
      </Btn>
      <Btn
        title="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={16} />
      </Btn>
      <Btn
        title="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={16} />
      </Btn>
      <Btn
        title="Justify"
        active={editor.isActive({ textAlign: "justify" })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify size={16} />
      </Btn>

      <span className="rt-divider" />

      <Btn
        title="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={16} />
      </Btn>
      <Btn title="2 columns" onClick={() => editor.chain().focus().insertColumns(2).run()}>
        <Columns2 size={16} />
      </Btn>
      <Btn title="3 columns" onClick={() => editor.chain().focus().insertColumns(3).run()}>
        <Columns3 size={16} />
      </Btn>

      <span className="rt-divider" />

      <Btn
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </Btn>
      <Btn
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={16} />
      </Btn>
    </div>
  );
}
