"use client";

import { useState } from "react";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";

import { puckConfig } from "./puck.config";
import { toEditorData } from "@/lib/puck/preview";

import "@/styles/puck-content.css";
import "@/styles/puck-editor.css";

// Hide Puck's built-in header — saving is handled by the surrounding event form.
const OVERRIDES = { header: () => null };

export default function EventPuckEditor({ value, onChange }) {
  // Initialise once from the incoming value (Puck JSON or legacy HTML/text).
  const [initialData] = useState(() => toEditorData(value));

  return (
    <div className="puck-editor-shell">
      <Puck
        config={puckConfig}
        data={initialData}
        iframe={{ enabled: false }}
        overrides={OVERRIDES}
        onChange={(data) => onChange(JSON.stringify(data))}
        height="100%"
      />
    </div>
  );
}
