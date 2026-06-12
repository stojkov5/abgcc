"use client";

import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { getNavOffset } from "@/lib/scroll";
import "../styles/scroll-cue.css";

/**
 * Animated "scroll down" hint for full-height hero sections.
 * Render it inside a `.page-hero`; clicking smooth-scrolls to the section
 * directly below the hero, offset for the fixed navbar.
 */
export default function ScrollCue({ label = "Scroll to content" }) {
  const rootRef = useRef(null);

  const handleClick = () => {
    const hero = rootRef.current?.closest(".page-hero");
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const target = rect.bottom + window.scrollY - getNavOffset();

    const lenis = typeof window !== "undefined" ? window.lenis : null;
    if (lenis) {
      lenis.scrollTo(target);
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  return (
    <button
      ref={rootRef}
      type="button"
      className="scroll-cue"
      onClick={handleClick}
      aria-label={label}
    >
      <span className="scroll-cue-track" aria-hidden="true" />
      <ChevronDown
        className="scroll-cue-chevron"
        size={20}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </button>
  );
}
