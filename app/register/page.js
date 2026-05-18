"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/auth.css";

const cardReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.09,
    },
  },
};

const itemReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);

    if (res.ok) {
      setForm({
        name: "",
        email: "",
        password: "",
      });
    }
  }

  return (
    <main className="auth-page">
      <motion.section
        className="auth-card"
        variants={cardReveal}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={itemReveal} className="auth-eyebrow">
          Join ABGCC
        </motion.p>

        <motion.h1 variants={itemReveal} className="auth-title">
          Create account
        </motion.h1>

        <motion.p variants={itemReveal} className="auth-text">
          Create your account to access membership features, events, and the
          ABGCC network.
        </motion.p>

        <motion.form
          variants={itemReveal}
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="auth-input"
          />

          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="auth-input"
          />

          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="auth-input"
          />

          <motion.button
            type="submit"
            disabled={loading}
            className="auth-submit"
            whileHover={!loading ? { y: -2 } : undefined}
            whileTap={!loading ? { scale: 0.98 } : undefined}
          >
            {loading ? "Creating..." : "Create account"}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {message && (
            <motion.p
              className="auth-message"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.p variants={itemReveal} className="auth-switch">
          Already have an account? <Link href="/login">Login</Link>
        </motion.p>
      </motion.section>
    </main>
  );
}