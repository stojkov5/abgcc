"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";
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

function VerifyEmailContent() {
  const params = useSearchParams();
  const success = params.get("success") === "1";

  return (
    <main className="auth-page">
      <motion.section
        className="auth-card"
        variants={cardReveal}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={itemReveal} className="auth-eyebrow">
          Email Verification
        </motion.p>

        <motion.h1 variants={itemReveal} className="auth-title">
          {success ? "Email Verified" : "Invalid Link"}
        </motion.h1>

        <motion.p variants={itemReveal} className="auth-text">
          {success
            ? "Your email address has been verified. You now have full access to all ABGCC member features."
            : "This verification link is invalid or has expired. Please register again or contact support."}
        </motion.p>

        <motion.div variants={itemReveal}>
          <Link href={success ? "/portal" : "/register"} className="auth-submit" style={{ display: "inline-block", textAlign: "center" }}>
            {success ? "Go to Portal" : "Register Again"}
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
