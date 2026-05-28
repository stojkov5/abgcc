export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import AdminShell from "@/components/AdminShell";

import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminStatus,
} from "@/components/admin/AdminUI";

import "@/styles/admin-memberships.css";

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
    <AdminShell>
      <div className="admin-memberships-page">
        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Membership Tiers"
          text="Manage membership pricing, visibility, descriptions, and tier structure for the ABGCC platform."
          action={
            <Link
              href="/admin/memberships/new"
              className="admin-memberships-create-btn"
            >
              <Plus size={17} />
              Add New Tier
            </Link>
          }
        />

        <AdminPanel title={`All Tiers (${tiers.length})`}>
          {tiers.length > 0 ? (
            <div className="admin-memberships-grid">
              {tiers.map((tier, index) => (
                <article
                  key={tier.id}
                  className="admin-membership-card"
                >
                  <div className="admin-membership-top">
                    <div>
                      <span className="admin-membership-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h2>{tier.title}</h2>

                      <div className="admin-membership-price">
                        ${tier.price.toLocaleString()}
                        <span> / {tier.period}</span>
                      </div>
                    </div>

                    <AdminStatus
                      variant={tier.active ? "active" : "inactive"}
                    >
                      {tier.active ? "Active" : "Inactive"}
                    </AdminStatus>
                  </div>

                  <p className="admin-membership-description">
                    {tier.description}
                  </p>

                  <div className="admin-membership-footer">
                    <Link
                      href={`/admin/memberships/${tier.id}/edit`}
                      className="admin-membership-edit-btn"
                    >
                      Edit Tier <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <AdminEmptyState text="No membership tiers found." />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}