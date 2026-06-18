"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, Check, X, ListChecks } from "lucide-react";

import { BENEFITS, tierBenefits } from "@/lib/membership/tiers";
import MembershipJoinButton from "@/components/MembershipJoinButton";
import BenefitInfo from "@/components/BenefitInfo";
import { Stagger, StaggerItem } from "@/components/MotionReveal";

export default function MembershipTiers({ tiers }) {
  const [openTier, setOpenTier] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!openTier) return;
    const onKey = (e) => e.key === "Escape" && setOpenTier(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // The site uses Lenis smooth scroll — pause it so the page can't scroll
    // behind the modal.
    window.lenis?.stop();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.lenis?.start();
    };
  }, [openTier]);

  function action(tier, size) {
    return tier.tierId ? (
      <MembershipJoinButton tierId={tier.tierId} tierTitle={tier.title} />
    ) : (
      <Link href="/contact" className={`membership-tier-btn ${size || ""}`}>
        Contact Us <ArrowRight size={16} />
      </Link>
    );
  }

  return (
    <>
      <Stagger className="mtiers-grid">
        {tiers.map((tier) => (
          <StaggerItem
            as="article"
            key={tier.key}
            className={`mtier-card ${tier.premier ? "is-premier" : ""}`}
          >
            {tier.premier && (
              <span className="mtier-premier-badge">Premier Membership</span>
            )}

            <h3 className="mtier-title">{tier.title}</h3>

            <div className="mtier-price">
              ${tier.price.toLocaleString()}
              <span>/ year</span>
            </div>

            <p className="mtier-desc">{tier.description}</p>

            <div className="mtier-actions">
              {action(tier)}

              <button
                type="button"
                className="mtier-benefits-btn"
                onClick={() => setOpenTier(tier)}
              >
                <ListChecks size={16} />
                See All Benefits
              </button>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Full-detail modal */}
      {mounted &&
        openTier &&
        createPortal(
          <div className="mtier-modal-overlay" onClick={() => setOpenTier(null)}>
            <div
              className={`mtier-modal ${openTier.premier ? "is-premier" : ""}`}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="mtier-modal-close"
                aria-label="Close"
                onClick={() => setOpenTier(null)}
              >
                <X size={18} />
              </button>

              {openTier.premier && (
                <span className="mtier-premier-badge mtier-modal-badge">
                  Premier Membership
                </span>
              )}

              <h3 className="mtier-modal-title">{openTier.title}</h3>

              <div className="mtier-price mtier-modal-price">
                ${openTier.price.toLocaleString()}
                <span>/ year</span>
              </div>

              <p className="mtier-modal-desc">{openTier.description}</p>

              <p className="mtier-modal-benefits-label">Included Benefits</p>

              <ul className="mtier-benefits mtier-modal-benefits">
                {tierBenefits(openTier.key).map((key) => (
                  <li key={key}>
                    <Check size={15} className="mtier-check" />
                    <span>{BENEFITS[key].label}</span>
                    <BenefitInfo
                      label={BENEFITS[key].label}
                      description={BENEFITS[key].description}
                    />
                  </li>
                ))}
              </ul>

              <div className="mtier-modal-action">{action(openTier)}</div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
