"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/auth.css";

const cardReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.09 },
  },
};

const itemReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
    if (res.ok) setSent(true);
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
          Password Reset
        </motion.p>

        <motion.h1 variants={itemReveal} className="auth-title">
          Forgot Password
        </motion.h1>

        <motion.p variants={itemReveal} className="auth-text">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </motion.p>

        {!sent && (
          <motion.form variants={itemReveal} onSubmit={handleSubmit} className="auth-form">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />

            <motion.button
              type="submit"
              disabled={loading}
              className="auth-submit"
              whileHover={!loading ? { y: -2 } : undefined}
              whileTap={!loading ? { scale: 0.98 } : undefined}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </motion.form>
        )}

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
          <Link href="/login">Back to Login</Link>
        </motion.p>
      </motion.section>
    </main>
  );
}
