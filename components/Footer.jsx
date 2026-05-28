"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Globe2,
  Mail,
  MapPin,
} from "lucide-react";

import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa6";

import { motion } from "framer-motion";
import "../styles/footer.css";

const footerReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const footerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      className="site-footer"
      variants={footerStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="footer-container">
        <motion.div
          className="footer-main"
          variants={footerReveal}
        >
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

            <p>
              Connecting Balkan and American business through
              investment, innovation, opportunity, and strategic
              global relationships.
            </p>

            <div className="footer-socials">
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>

              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>

              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
  <div className="footer-column">
    <h3>Navigation</h3>

    <Link href="/about">About</Link>
    <Link href="/membership">Membership</Link>
    <Link href="/events">Events</Link>
    <Link href="/contact">Contact</Link>
  </div>

  <div className="footer-column">
    <h3>Member Access</h3>

    <Link href="/login">Member Login</Link>
    <Link href="/register">Create Account</Link>
    <Link href="/portal">Profile</Link>
  </div>

  <div className="footer-column">
    <h3>Press</h3>

    <Link href="/press-releases">Press Releases</Link>
    <Link href="/media-features">Media Features</Link>
  </div>

  <div className="footer-column">
    <h3>Contact</h3>

    <span>
      <Globe2 size={16} />
      United States · Balkans · Global
    </span>

    <span>
      <MapPin size={16} />
      New York / Balkan Markets
    </span>

    <span>
      <Mail size={16} />
      info@abgcc.org
    </span>
  </div>
</div>
        </motion.div>

        
      </div>
    </motion.footer>
  );
}