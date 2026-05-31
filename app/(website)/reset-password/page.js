"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: form.password }),
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);

    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    }
  }

  if (!token) {
    return (
      <main className="auth-page">
        <motion.section className="auth-card" variants={cardReveal} initial="hidden" animate="visible">
          <motion.h1 variants={itemReveal} className="auth-title">Invalid Link</motion.h1>
          <motion.p variants={itemReveal} className="auth-text">This reset link is invalid. Please request a new one.</motion.p>
          <motion.p variants={itemReveal} className="auth-switch">
            <Link href="/forgot-password">Request new link</Link>
          </motion.p>
        </motion.section>
      </main>
    );
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
          New Password
        </motion.h1>

        <motion.p variants={itemReveal} className="auth-text">
          Enter your new password below. Minimum 8 characters.
        </motion.p>

        {!done && (
          <motion.form variants={itemReveal} onSubmit={handleSubmit} className="auth-form">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              placeholder="New password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="auth-input"
              required
              minLength={8}
            />

            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              placeholder="Confirm new password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
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
              {loading ? "Saving..." : "Set New Password"}
            </motion.button>
          </motion.form>
        )}

        <AnimatePresence>
          {message && (
            <motion.p
              className={`auth-message ${done ? "" : "error"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {message} {done && "Redirecting to login..."}
            </motion.p>
          )}
        </AnimatePresence>

        {!done && (
          <motion.p variants={itemReveal} className="auth-switch">
            <Link href="/login">Back to Login</Link>
          </motion.p>
        )}
      </motion.section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
