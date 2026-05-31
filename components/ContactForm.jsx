"use client";

import HeroVideo from "@/components/HeroVideo";
import "@/styles/contact.css";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { RevealWords } from "@/components/MotionReveal";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);
      setResponseMessage(data.message);
      if (res.ok) setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setResponseMessage("Something went wrong.");
    }
  }

  return (
    <main className="contact-page">
      <section className="page-hero contact-hero">
        <HeroVideo video="/Contact.mp4" poster="/ContactPoster.webp" />
        <div className="page-hero-overlay" />
        <div className="page-hero-shell contact-hero-shell">
          <motion.div
            className="page-hero-content contact-hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <p className="page-hero-eyebrow">Contact ABGCC</p>
              <h1 className="page-hero-title title-dark">
                <RevealWords delay={0.12} wordDelay={0.1}>Connect with us</RevealWords>
              </h1>
              <p className="contact-hero-text">
                Reach out for membership, partnerships, events, investment
                opportunities, or general inquiries.
              </p>
            </motion.div>

            <motion.div className="contact-form-card" variants={fadeUp}>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-columns">
                  <div className="contact-form-column">
                    <div className="contact-field">
                      <label htmlFor="name">Name</label>
                      <input id="name" name="name" type="text" placeholder="Your name"
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="subject">Title</label>
                      <input id="subject" name="subject" type="text" placeholder="Message title"
                        value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                    </div>
                  </div>
                  <div className="contact-form-column">
                    <div className="contact-field">
                      <label htmlFor="email">Email</label>
                      <input id="email" name="email" type="email" placeholder="your@email.com"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="contact-field contact-message-field">
                      <label htmlFor="message">Message</label>
                      <textarea id="message" name="message" placeholder="Write your message..."
                        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                  </div>
                </div>

                <button type="submit" className="contact-submit-btn" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                  <Send size={17} />
                </button>

                {responseMessage && (
                  <p className="contact-response-message">{responseMessage}</p>
                )}
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
