"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

import "@/styles/members.css";

export default function MembersOnlyGate() {
  const router = useRouter();

  return (
    <div className="members-gate">
      <motion.div
        className="members-gate-card"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
      >
        <div className="members-gate-icon">
          <Lock size={26} />
        </div>

        <h1>You are not a member</h1>
        <p>
          The Members Directory is a members-only section of the ABGCC. Become a
          member to view and connect with the chamber network.
        </p>

        <div className="members-gate-actions">
          <Link
            href="/membership#membership-tiers"
            className="members-gate-primary"
          >
            View Memberships
          </Link>

          <button
            type="button"
            className="members-gate-ghost"
            onClick={() => router.back()}
          >
            Back to Page
          </button>
        </div>
      </motion.div>
    </div>
  );
}
