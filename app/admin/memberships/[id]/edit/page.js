export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import EditMembershipForm from "@/components/EditMembershipForm";

import {
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/AdminUI";

import "@/styles/admin-memberships.css";

export default async function EditMembershipTierPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const { id } = await params;

  const tier = await prisma.membershipTier.findUnique({
    where: {
      id,
    },
  });

  if (!tier) notFound();

  return (
    <AdminShell>
      <div className="admin-memberships-page">
        <Link href="/admin/memberships" className="admin-memberships-back-link">
          <ArrowLeft size={16} />
          Back to Memberships
        </Link>

        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Edit Membership Tier"
          text="Update pricing, billing period, description, and visibility for this membership tier."
        />

        <AdminPanel>
          <EditMembershipForm tier={tier} />
        </AdminPanel>
      </div>
    </AdminShell>
  );
}