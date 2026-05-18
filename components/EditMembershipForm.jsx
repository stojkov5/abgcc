"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditMembershipForm({ tier }) {
  const [form, setForm] = useState({
    title: tier.title,
    description: tier.description,
    price: tier.price,
    period: tier.period,
    active: tier.active,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/admin/memberships/${tier.id}`, {
      method: "PUT",
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
    <>
      <form onSubmit={handleSubmit} className="admin-form">
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
          {loading ? "Saving..." : "Save Changes"}
        </motion.button>
      </form>

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
    </>
  );
}