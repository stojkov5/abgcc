export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import NewPostForm from "@/components/NewPostForm";

import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUI";

import "@/styles/admin-events.css";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  return (
    <AdminShell>
      <div className="admin-events-page">
        <Link href="/admin/posts" className="admin-events-back-link">
          <ArrowLeft size={16} />
          Back to News
        </Link>

        <AdminPageHeader
          eyebrow="Admin Panel"
          title="New Article"
          text="Write a news article or blog post with a cover image, summary, and rich content."
        />

        <AdminPanel>
          <NewPostForm />
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
