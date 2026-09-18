export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import TeamMemberForm from "@/components/TeamMemberForm";

import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUI";

import "@/styles/admin.css";
import "@/styles/admin-events.css";

export default async function NewTeamMemberPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  return (
    <AdminShell>
      <div className="admin-events-page">
        <Link href="/admin/team" className="admin-events-back-link">
          <ArrowLeft size={16} />
          Back to Team & Advisory Board
        </Link>

        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Add Person"
          text="Add a new person to the Meet the Team or Advisory Board section of the About page."
        />

        <AdminPanel>
          <TeamMemberForm />
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
