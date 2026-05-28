"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function MembershipCheckoutButton({ tierId }) {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (status !== "authenticated") {
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    const res = await fetch("/api/stripe/checkout/membership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tierId }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok && data.url) {
      window.location.href = data.url;
      return;
    }

    alert(data.message || "Something went wrong.");
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className="membership-tier-btn"
    >
      {loading ? "Redirecting..." : "Join Now"}
    </button>
  );
}