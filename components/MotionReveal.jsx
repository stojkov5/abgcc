"use client";

import { motion } from "motion/react";

// Silk ease — slow start, confident finish
const silk = [0.25, 0.46, 0.45, 0.94];
// Expo out — fast start, long elegant tail
const expo = [0.16, 1, 0.3, 1];

/**
 * Reveal — blur + rise. The main scroll reveal.
 * Elements arrive slightly soft and rise into clarity.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 22,
  duration = 0.9,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration, delay, ease: expo }}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealWords — word-by-word stagger for hero headings.
 * Pass text as a string child. Returns a <span> wrapper.
 */
export function RevealWords({
  children,
  className = "",
  delay = 0,
  wordDelay = 0.055,
}) {
  const words = String(children).split(" ");

  return (
    <span className={className} style={{ display: "block" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre" }}
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.75,
            delay: delay + i * wordDelay,
            ease: expo,
          }}
        >
          {word}{i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * RevealLine — animated horizontal rule that grows from left.
 * Use as a section divider.
 */
export function RevealLine({ className = "", delay = 0, color = "var(--gold-main)" }) {
  return (
    <motion.div
      className={className}
      style={{
        height: 1,
        background: color,
        transformOrigin: "left center",
        opacity: 0.45,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 0.45 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.1, delay, ease: silk }}
    />
  );
}

/**
 * FadeIn — pure opacity, no movement. For backgrounds and overlays.
 */
export function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = 1.1,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleReveal — gentle scale-in for cards and feature blocks.
 */
export function ScaleReveal({
  children,
  className = "",
  delay = 0,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.0, delay, ease: expo }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger — viewport-triggered stagger container.
 */
export function Stagger({
  children,
  className = "",
  staggerDelay = 0.11,
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — child of Stagger. Blur + rise.
 */
export function StaggerItem({
  children,
  className = "",
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.85, ease: expo },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
