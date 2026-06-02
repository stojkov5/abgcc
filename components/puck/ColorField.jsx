"use client";

import { COLOR_SWATCHES } from "@/lib/puck/colors";

// Custom Puck field: a small swatch palette limited to the ABGCC brand colors.
export default function ColorField({ value, onChange }) {
  const current = value || "default";

  return (
    <div className="puck-color-field">
      {COLOR_SWATCHES.map((swatch) => (
        <button
          key={swatch.value}
          type="button"
          title={swatch.label}
          aria-label={swatch.label}
          aria-pressed={current === swatch.value}
          className={`puck-color-swatch${
            current === swatch.value ? " is-active" : ""
          }`}
          onClick={() => onChange(swatch.value)}
        >
          <span style={{ background: swatch.color }} />
        </button>
      ))}
    </div>
  );
}
