export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import EditMembershipForm from "@/components/EditMembershipForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  HeroReveal,
  HeroItem,
} from "@/components/MotionReveal";

import "../../../../../styles/admin.css";

export default async function EditMembershipTierPage({ params }) {
  const { id } = await params;

  const tier = await prisma.membershipTier.findUnique({
    where: {
      id,
    },
  });

  if (!tier) {
    return (
      <main className="admin-page">
        <section className="admin-form-shell">
          <div className="admin-form-card">
            <Link href="/admin/memberships" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Memberships
            </Link>

            <p className="admin-eyebrow">Admin</p>

            <h1 className="admin-form-title">
              Membership tier not found.
            </h1>

            <p className="admin-form-text">
              This membership tier may have been deleted or the link may be
              incorrect.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-form-shell">
        <HeroReveal className="admin-form-card">
          <HeroItem>
            <Link href="/admin/memberships" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Memberships
            </Link>
          </HeroItem>

          <HeroItem as="p" className="admin-eyebrow">
            Admin
          </HeroItem>

          <HeroItem as="h1" className="admin-form-title">
            Edit Membership Tier
          </HeroItem>

          <HeroItem as="p" className="admin-form-text">
            Update pricing, billing period, description, and visibility for this
            membership tier.
          </HeroItem>

          <HeroItem>
            <EditMembershipForm tier={tier} />
          </HeroItem>
        </HeroReveal>
      </section>
    </main>
  );
}