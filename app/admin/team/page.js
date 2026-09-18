export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import DeleteTeamMemberButton from "@/components/DeleteTeamMemberButton";
import TeamVisibilityToggle from "@/components/TeamVisibilityToggle";

import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminStatus,
} from "@/components/admin/AdminUI";

import "@/styles/admin-events.css";

const SECTION_LABELS = {
  TEAM: "Meet the Team",
  ADVISORY: "Advisory Board",
};

function MembersTable({ members }) {
  return (
    <div className="admin-events-table-card">
      <div className="admin-events-table-wrap">
        <table className="admin-events-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Order</th>
              <th>Status</th>
              <th className="admin-events-table-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <span className="admin-events-title">{member.name}</span>
                </td>

                <td>{member.role}</td>

                <td>{member.order}</td>

                <td>
                  <AdminStatus variant={member.visible ? "active" : "inactive"}>
                    {member.visible ? "Visible" : "Hidden"}
                  </AdminStatus>
                </td>

                <td className="admin-events-table-actions">
                  <div className="admin-events-actions-group">
                    <TeamVisibilityToggle
                      memberId={member.id}
                      visible={member.visible}
                    />

                    <Link
                      href={`/admin/team/${member.id}/edit`}
                      className="admin-events-table-link"
                    >
                      Edit <ArrowRight size={14} />
                    </Link>

                    <DeleteTeamMemberButton
                      memberId={member.id}
                      memberName={member.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AdminTeamPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const members = await prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const team = members.filter((m) => m.section === "TEAM");
  const advisory = members.filter((m) => m.section === "ADVISORY");

  return (
    <AdminShell>
      <div className="admin-events-page">
        <AdminPageHeader
          eyebrow="Admin Panel"
          title="About — Team & Advisory Board"
          text="Create, edit, reorder, delete, and choose which people show on the public About page."
          action={
            <Link href="/admin/team/new" className="admin-events-create-btn">
              <Plus size={17} />
              Add Person
            </Link>
          }
        />

        <AdminPanel title={`${SECTION_LABELS.TEAM} (${team.length})`}>
          {team.length > 0 ? (
            <MembersTable members={team} />
          ) : (
            <AdminEmptyState text="No team members yet." />
          )}
        </AdminPanel>

        <AdminPanel title={`${SECTION_LABELS.ADVISORY} (${advisory.length})`}>
          {advisory.length > 0 ? (
            <MembersTable members={advisory} />
          ) : (
            <AdminEmptyState text="No advisory board members yet." />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
