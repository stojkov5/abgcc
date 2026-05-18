"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const softReveal = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export function Reveal({ children, className = "", type = "fade", amount = 0.25 }) {
  return (
    <motion.div
      className={className}
      variants={type === "soft" ? softReveal : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = "", amount = 0.2 }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", as = "div" }) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={softReveal}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </Component>
  );
}

export function HeroReveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function HeroItem({ children, className = "", as = "div" }) {
  const Component = motion[as];

  return (
    <Component variants={fadeUp} className={className}>
      {children}
    </Component>
  );
}

export function HeroImageZoom({ children }) {
  return (
    <motion.div
      initial={{ scale: 1.06 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}