export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import NewMembershipTierForm from "@/components/NewMembershipTierForm";

import {
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/AdminUI";

import "@/styles/admin-memberships.css";

export default async function NewMembershipTierPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  return (
    <AdminShell>
      <div className="admin-memberships-page">
        <Link href="/admin/memberships" className="admin-memberships-back-link">
          <ArrowLeft size={16} />
          Back to Memberships
        </Link>

        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Add Membership Tier"
          text="Create a new membership tier with pricing, billing period, description, and visibility status."
        />

        <AdminPanel>
          <NewMembershipTierForm />
        </AdminPanel>
      </div>
    </AdminShell>
  );
}