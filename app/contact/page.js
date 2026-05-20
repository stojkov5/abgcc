"use client";

import "../../styles/contact.css";
import Image from "next/image";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

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
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <Image
          src="/Contact.webp"
          alt="Contact American Balkan Global Chamber of Commerce"
          fill
          priority
          className="page-hero-img"
        />

        <div className="page-hero-overlay" />

        <div className="contact-hero-shell">
          <motion.div
            className="contact-layout"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="contact-copy" variants={fadeUp}>
              <p className="page-hero-eyebrow">Contact ABGCC</p>

              <h1 className="page-hero-title">
                Let’s start a serious business conversation.
              </h1>

              <p className="contact-text">
                Reach out to the American Balkan Global Chamber of Commerce for
                membership, partnerships, events, investment opportunities, or
                general inquiries.
              </p>
            </motion.div>

            <motion.div className="contact-form-card" variants={fadeUp}>
              <form className="contact-form">
                <div className="contact-field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" placeholder="Your name" />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" placeholder="your@email.com" />
                </div>

                <div className="contact-field">
                  <label htmlFor="title">Title</label>
                  <input id="title" name="title" type="text" placeholder="Message title" />
                </div>

                <div className="contact-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Write your message..."
                  />
                </div>

                <button type="submit" className="contact-submit-btn">
                  Send Message <Send size={17} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}