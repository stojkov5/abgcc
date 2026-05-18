export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {
  HeroReveal,
  HeroItem,
  Stagger,
  StaggerItem,
} from "@/components/MotionReveal";

import "../../../styles/admin.css";

export default async function AdminMembershipsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const tiers = await prisma.membershipTier.findMany({
    orderBy: {
      price: "asc",
    },
  });

  return (
    <main className="admin-page">
      <section className="admin-container">
        <div className="admin-topbar">
          <HeroReveal>
            <HeroItem as="p" className="admin-eyebrow">
              Admin
            </HeroItem>

            <HeroItem as="h1" className="admin-title">
              Membership Tiers
            </HeroItem>

            <HeroItem as="p" className="admin-text">
              Manage membership pricing, visibility, descriptions, and tier
              structure for the ABGCC platform.
            </HeroItem>
          </HeroReveal>

          <Link
            href="/admin/memberships/new"
            className="admin-primary-btn"
          >
            <Plus size={17} />
            Add New Tier
          </Link>
        </div>

        <Stagger className="admin-membership-grid">
          {tiers.map((tier, index) => (
            <StaggerItem
              as="article"
              key={tier.id}
              className="admin-membership-card"
            >
              <div className="admin-membership-top">
                <div>
                  <span className="admin-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h2>{tier.title}</h2>

                  <div className="admin-tier-price">
                    ${tier.price.toLocaleString()}
                    <span> / {tier.period}</span>
                  </div>
                </div>

                <div
                  className={`admin-status ${
                    tier.active ? "active" : "inactive"
                  }`}
                >
                  {tier.active ? "Active" : "Inactive"}
                </div>
              </div>

              <p className="admin-membership-description">
                {tier.description}
              </p>

              <div className="admin-membership-footer">
                <Link
                  href={`/admin/memberships/${tier.id}/edit`}
                  className="admin-secondary-btn"
                >
                  Edit Tier <ArrowRight size={15} />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  );
}