export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import EditPostForm from "@/components/EditPostForm";

import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUI";

import "@/styles/admin-events.css";

export default async function EditPostPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <AdminShell>
      <div className="admin-events-page">
        <Link href="/admin/posts" className="admin-events-back-link">
          <ArrowLeft size={16} />
          Back to News
        </Link>

        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Edit Article"
          text="Update the article content, cover image, summary, or publishing status."
        />

        <AdminPanel>
          <EditPostForm post={post} />
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
