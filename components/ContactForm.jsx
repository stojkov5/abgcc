"use client";

import { useEffect, useState } from "react";
import HeroVideo from "@/components/HeroVideo";
import "@/styles/contact.css";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { RevealWords } from "@/components/MotionReveal";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Load reCAPTCHA v3 script once
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    if (document.getElementById("recaptcha-script")) return;

    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  async function getRecaptchaToken() {
    if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) return null;
    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "contact" });
          resolve(token);
        } catch {
          resolve(null);
        }
      });
    });
  }

  function validate() {
    const errors = {};
    if (!form.name.trim())                     errors.name    = "Name is required.";
    if (!form.email.trim())                    errors.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email.";
    if (!form.subject.trim())                  errors.subject = "Subject is required.";
    if (!form.message.trim())                  errors.message = "Message is required.";
    else if (form.message.trim().length < 10)  errors.message = "Message is too short (min 10 characters).";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResponseMessage("");
    setSuccess(false);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);

    const recaptchaToken = await getRecaptchaToken();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess(true);
        setResponseMessage(data.message);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setResponseMessage(data.message || "Something went wrong.");
        if (data.errors) setFieldErrors(data.errors);
      }
    } catch {
      setLoading(false);
      setResponseMessage("Something went wrong. Please try again.");
    }
  }

  function field(id, label, type = "input", placeholder = "") {
    const error = fieldErrors[id];
    return (
      <div className={`contact-field ${error ? "contact-field--error" : ""}`}>
        <label htmlFor={id}>{label}</label>
        {type === "textarea" ? (
          <textarea
            id={id}
            name={id}
            placeholder={placeholder}
            value={form[id]}
            onChange={(e) => {
              setForm({ ...form, [id]: e.target.value });
              if (fieldErrors[id]) setFieldErrors({ ...fieldErrors, [id]: null });
            }}
          />
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={form[id]}
            onChange={(e) => {
              setForm({ ...form, [id]: e.target.value });
              if (fieldErrors[id]) setFieldErrors({ ...fieldErrors, [id]: null });
            }}
          />
        )}
        {error && <span className="contact-field-error">{error}</span>}
      </div>
    );
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
              {success ? (
                <div className="contact-success">
                  <div className="contact-success-icon">✓</div>
                  <h3>Message sent!</h3>
                  <p>{responseMessage}</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="contact-form-columns">
                    <div className="contact-form-column">
                      {field("name",    "Name",    "text",  "Your name")}
                      {field("subject", "Subject", "text",  "Message subject")}
                    </div>
                    <div className="contact-form-column">
                      {field("email",   "Email",   "email", "your@email.com")}
                      {field("message", "Message", "textarea", "Write your message...")}
                    </div>
                  </div>

                  <button type="submit" className="contact-submit-btn" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                    <Send size={17} />
                  </button>

                  {responseMessage && !success && (
                    <p className="contact-response-message contact-response-message--error">
                      {responseMessage}
                    </p>
                  )}

                  {RECAPTCHA_SITE_KEY && (
                    <p className="contact-recaptcha-notice">
                      Protected by reCAPTCHA.{" "}
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>{" "}
                      &amp;{" "}
                      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms</a>.
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
