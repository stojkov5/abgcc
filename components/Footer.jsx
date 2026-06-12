"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Globe2, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa6";

import "../styles/footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubscribe(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setDone(true);
        setMessage(data.message);
        setEmail("");
      } else {
        setIsError(true);
        setMessage(data.message || "Something went wrong.");
      }
    } catch {
      setLoading(false);
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <footer className="site-footer">
      {/* ===== Upper band — Subscribe ===== */}
      <div className="footer-subscribe">
        <div className="footer-inner footer-subscribe-grid">
          <div className="footer-subscribe-main">
            <h2>Subscribe</h2>
            <p>
              Stay informed of our latest updates by subscribing to the ABGCC
              newsletter!
            </p>

            {done ? (
              <div className="footer-subscribe-success">
                <CheckCircle2 size={18} />
                <span>{message}</span>
              </div>
            ) : (
              <form className="footer-subscribe-form" onSubmit={handleSubscribe} noValidate>
                <label htmlFor="footer-email">
                  Your email <span>*</span>
                </label>

                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Subscribing…" : "Subscribe"}
                  <Send size={15} />
                </button>

                {message && !done && (
                  <p className={`footer-subscribe-msg ${isError ? "error" : ""}`}>
                    {message}
                  </p>
                )}
              </form>
            )}
          </div>

          <div className="footer-follow">
            <h3>Follow Us</h3>

            <a href="#" className="footer-social-row" aria-label="LinkedIn">
              <FaLinkedinIn /> LinkedIn
            </a>
            <a href="#" className="footer-social-row" aria-label="Instagram">
              <FaInstagram /> Instagram
            </a>
            <a href="#" className="footer-social-row" aria-label="Facebook">
              <FaFacebookF /> Facebook
            </a>
          </div>

          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <Image
                src="/abgcc.webp"
                alt="ABGCC Logo"
                width={180}
                height={70}
                className="footer-logo-img"
              />
            </Link>

            <div className="footer-brand-contact">
              <span>
                <Globe2 size={15} />
                United States · Balkans · Global
              </span>
              <span>
                <MapPin size={15} />
                New York / Balkan Markets
              </span>
              <span>
                <Mail size={15} />
                info@abgcc.org
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Lower band — Footer links ===== */}
      <div className="footer-main-band">
        <div className="footer-inner">
          <div className="footer-links-grid">
            <div className="footer-column">
              <h3>Navigation</h3>
              <Link href="/about">About</Link>
              <Link href="/services">Services</Link>
              <Link href="/membership">Membership</Link>
              <Link href="/events">Events</Link>
              <Link href="/news">News</Link>
              <Link href="/contact">Contact</Link>
            </div>

            <div className="footer-column">
              <h3>Membership</h3>
              <Link href="/membership">Join ABGCC</Link>
              <Link href="/members">Members Directory</Link>
              <Link href="/portal">My Profile</Link>
            </div>

            <div className="footer-column">
              <h3>Events</h3>
              <Link href="/events#upcoming">Upcoming Events</Link>
              <Link href="/events#past">Past Events</Link>
            </div>

            <div className="footer-column">
              <h3>Member Access</h3>
              <Link href="/login">Member Login</Link>
              <Link href="/register">Create Account</Link>
            </div>

            <div className="footer-column">
              <h3>Contact</h3>
              <span>
                <Globe2 size={15} />
                United States · Balkans · Global
              </span>
              <span>
                <Mail size={15} />
                info@abgcc.org
              </span>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              © {year} American Balkan Global Chamber of Commerce. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
