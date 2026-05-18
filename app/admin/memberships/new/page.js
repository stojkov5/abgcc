"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../../../styles/admin.css";

const cardReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
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

export default function NewMembershipTierPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    period: "yearly",
    active: true,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/memberships", {
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
      window.location.href = "/admin/memberships";
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-form-shell">
        <motion.div
          className="admin-form-card"
          variants={cardReveal}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemReveal}>
            <Link href="/admin/memberships" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Memberships
            </Link>
          </motion.div>

          <motion.p variants={itemReveal} className="admin-eyebrow">
            Admin
          </motion.p>

          <motion.h1 variants={itemReveal} className="admin-form-title">
            Add Membership Tier
          </motion.h1>

          <motion.p variants={itemReveal} className="admin-form-text">
            Create a new membership tier with pricing, billing period,
            description, and visibility status.
          </motion.p>

          <motion.form
            variants={itemReveal}
            onSubmit={handleSubmit}
            className="admin-form"
          >
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="admin-input"
            />

            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={5}
              className="admin-input admin-textarea"
            />

            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="admin-input"
            />

            <motion.select
              whileFocus={{ scale: 1.01 }}
              value={form.period}
              onChange={(e) =>
                setForm({ ...form, period: e.target.value })
              }
              className="admin-input"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </motion.select>

            <label className="admin-check-row">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
              />
              <span>Active</span>
            </label>

            <motion.button
              type="submit"
              disabled={loading}
              className="admin-submit-btn"
              whileHover={!loading ? { y: -2 } : undefined}
              whileTap={!loading ? { scale: 0.98 } : undefined}
            >
              {loading ? "Creating..." : "Create Tier"}
            </motion.button>
          </motion.form>

          <AnimatePresence>
            {message && (
              <motion.p
                className="admin-form-message"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}