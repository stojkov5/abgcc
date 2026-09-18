export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import TeamMemberForm from "@/components/TeamMemberForm";

import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUI";

import "@/styles/admin.css";
import "@/styles/admin-events.css";

export default async function EditTeamMemberPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const { id } = await params;

  const member = await prisma.teamMember.findUnique({ where: { id } });

  if (!member) notFound();

  return (
    <AdminShell>
      <div className="admin-events-page">
        <Link href="/admin/team" className="admin-events-back-link">
          <ArrowLeft size={16} />
          Back to Team & Advisory Board
        </Link>

        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Edit Person"
          text="Update this person's details, photo, section, order, or visibility."
        />

        <AdminPanel>
          <TeamMemberForm member={member} />
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
