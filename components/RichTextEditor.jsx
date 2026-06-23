"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  TextStyle,
  FontSize,
  Color,
  FontFamily,
} from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";

import { ResizableImage } from "@/components/editor/extensions/resizableImage";
import { Column, ColumnBlock } from "@/components/editor/extensions/columns";
import EditorToolbar from "@/components/editor/EditorToolbar";
import { contentToHtml } from "@/lib/puck/toHtml";

import "@/styles/rich-content.css";
import "@/styles/rich-text-editor.css";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the content…",
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ResizableImage.configure({
        inline: false,
        HTMLAttributes: { class: "rt-image" },
      }),
      Placeholder.configure({ placeholder }),
      ColumnBlock,
      Column,
    ],
    content: contentToHtml(value),
    editorProps: {
      attributes: { class: "rich-content rt-editor-surface" },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  return (
    <div className="rt-editor">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
