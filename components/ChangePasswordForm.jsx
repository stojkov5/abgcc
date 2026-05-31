"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChangePasswordForm({ emailVerified }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (form.newPassword !== form.confirmPassword) {
      setIsError(true);
      setMessage("New passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/portal/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    });

    const data = await res.json();
    setIsError(!res.ok);
    setMessage(data.message);
    setLoading(false);

    if (res.ok) {
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  }

  return (
    <div className="portal-card" style={{ maxWidth: 520 }}>
      <span className="portal-card-label">Change Password</span>

      {!emailVerified && (
        <div
          style={{
            background: "#fef3cd",
            border: "1px solid #f59e0b",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 20,
            fontSize: 14,
            color: "#92400e",
          }}
        >
          Your email is not verified. Please verify your email to change your
          password.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input
          type="password"
          placeholder="Current password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          className="auth-input"
          required
          disabled={!emailVerified}
        />

        <input
          type="password"
          placeholder="New password (min. 8 characters)"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          className="auth-input"
          required
          minLength={8}
          disabled={!emailVerified}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="auth-input"
          required
          disabled={!emailVerified}
        />

        <motion.button
          type="submit"
          disabled={loading || !emailVerified}
          className="auth-submit"
          whileHover={!loading && emailVerified ? { y: -2 } : undefined}
          whileTap={!loading && emailVerified ? { scale: 0.98 } : undefined}
          style={{ marginTop: 4 }}
        >
          {loading ? "Saving..." : "Change Password"}
        </motion.button>
      </form>

      <AnimatePresence>
        {message && (
          <motion.p
            className={`auth-message ${isError ? "error" : ""}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 12 }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
