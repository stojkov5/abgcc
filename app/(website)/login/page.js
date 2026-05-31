"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/auth.css";

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

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setLoading(false);
      setMessage("Invalid email or password.");
      return;
    }

    const profileRes = await fetch("/api/portal/me", {
      method: "GET",
      cache: "no-store",
    });

    const profileData = await profileRes.json();

    setLoading(false);

    if (!profileRes.ok) {
      window.location.href = "/portal";
      return;
    }

    if (profileData.user?.role === "SUPER_ADMIN") {
      window.location.href = "/admin";
      return;
    }

    if (!profileData.user?.profileCompleted) {
      window.location.href = "/portal/profile";
      return;
    }

    window.location.href = "/portal";
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
          Member Access
        </motion.p>

        <motion.h1 variants={itemReveal} className="auth-title">
          Login
        </motion.h1>

        <motion.p variants={itemReveal} className="auth-text">
          Access your ABGCC member portal, membership details, and event
          registrations.
        </motion.p>

        <motion.form
          variants={itemReveal}
          onSubmit={handleSubmit}
          className="auth-form"
        >
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
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {message && (
            <motion.p
              className="auth-message error"
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
          <Link href="/forgot-password">Forgot password?</Link>
        </motion.p>

        <motion.p variants={itemReveal} className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link href="/register">Create account</Link>
        </motion.p>
      </motion.section>
    </main>
  );
}