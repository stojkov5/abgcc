"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { CreditCard, Landmark, X, ArrowRight } from "lucide-react";

export default function MembershipJoinButton({ tierId, tierTitle }) {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(""); // "" | "card" | "bank"

  useEffect(() => setMounted(true), []);

  // Lock body scroll + close on Escape while the modal is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function openModal() {
    if (status !== "authenticated") {
      window.location.href = "/login";
      return;
    }
    setOpen(true);
  }

  async function payByCard() {
    setLoading("card");
    const res = await fetch("/api/stripe/checkout/membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tierId }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
      return;
    }
    setLoading("");
    alert(data.message || "Something went wrong.");
  }

  async function payByBank() {
    setLoading("bank");
    const res = await fetch("/api/membership/bank-transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tierId }),
    });
    const data = await res.json();
    if (res.ok && data.reference) {
      window.location.href = `/portal/invoice/${data.reference}`;
      return;
    }
    setLoading("");
    alert(data.message || "Something went wrong.");
  }

  const busy = loading !== "";

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="membership-tier-btn"
      >
        Join Now <ArrowRight size={16} />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="membership-modal-overlay"
            onClick={() => !busy && setOpen(false)}
          >
            <div
              className="membership-modal"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="membership-modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
                disabled={busy}
              >
                <X size={18} />
              </button>

              <p className="membership-modal-eyebrow">Complete Your Membership</p>
              <h3 className="membership-modal-title">
                {tierTitle || "Choose how to pay"}
              </h3>
              <p className="membership-modal-text">
                Select your preferred payment method to continue.
              </p>

              <div className="membership-modal-options">
                <button
                  type="button"
                  className="membership-modal-option primary"
                  onClick={payByCard}
                  disabled={busy}
                >
                  <span className="membership-modal-option-icon">
                    <CreditCard size={20} />
                  </span>
                  <span className="membership-modal-option-body">
                    <strong>
                      {loading === "card" ? "Redirecting…" : "Pay by Card"}
                    </strong>
                    <small>Instant activation via secure Stripe checkout</small>
                  </span>
                  <ArrowRight size={16} className="membership-modal-option-arrow" />
                </button>

                <button
                  type="button"
                  className="membership-modal-option"
                  onClick={payByBank}
                  disabled={busy}
                >
                  <span className="membership-modal-option-icon">
                    <Landmark size={20} />
                  </span>
                  <span className="membership-modal-option-body">
                    <strong>
                      {loading === "bank" ? "Preparing invoice…" : "Pay by Bank Transfer"}
                    </strong>
                    <small>Receive an invoice with ABGCC bank details</small>
                  </span>
                  <ArrowRight size={16} className="membership-modal-option-arrow" />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
