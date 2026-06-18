"use client";

import { useState } from "react";
import { Info } from "lucide-react";

export default function BenefitInfo({ label, description }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="benefit-info"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="benefit-info-btn"
        aria-label={`About ${label}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Info size={14} />
      </button>

      {open && (
        <span className="benefit-info-pop" role="tooltip">
          <strong>{label}</strong>
          {description}
        </span>
      )}
    </span>
  );
}
