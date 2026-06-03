export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import DeletePostButton from "@/components/DeletePostButton";

import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminStatus,
} from "@/components/admin/AdminUI";

import "@/styles/admin-events.css";

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell>
      <div className="admin-events-page">
        <AdminPageHeader
          eyebrow="Admin Panel"
          title="News & Blog"
          text="Write, publish, and manage ABGCC news articles and blog posts."
          action={
            <Link href="/admin/posts/new" className="admin-events-create-btn">
              <Plus size={17} />
              New Article
            </Link>
          }
        />

        <AdminPanel title={`All Articles (${posts.length})`}>
          {posts.length > 0 ? (
            <div className="admin-events-table-card">
              <div className="admin-events-table-wrap">
                <table className="admin-events-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="admin-events-table-actions">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <span className="admin-events-title">
                            {post.title}
                          </span>
                        </td>

                        <td>{post.author || "—"}</td>

                        <td>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>

                        <td>
                          <AdminStatus
                            variant={post.published ? "active" : "inactive"}
                          >
                            {post.published ? "Published" : "Draft"}
                          </AdminStatus>
                        </td>

                        <td className="admin-events-table-actions">
                          <div className="admin-events-actions-group">
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="admin-events-table-link"
                            >
                              Edit <ArrowRight size={14} />
                            </Link>

                            <DeletePostButton
                              postId={post.id}
                              postTitle={post.title}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <AdminEmptyState text="No articles yet. Create your first one." />
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
