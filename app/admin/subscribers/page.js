export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import SubscribersAdmin from "@/components/SubscribersAdmin";
import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUI";

import "@/styles/admin.css";
import "@/styles/admin-subscribers.css";

export default async function AdminSubscribersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell>
      <div className="admin-subscribers-page">
        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Newsletter Subscribers"
          text="Everyone who has subscribed through the website. Export the list to use in your email tool."
        />

        <AdminPanel title={`All Subscribers (${subscribers.length})`}>
          <SubscribersAdmin subscribers={subscribers} />
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
