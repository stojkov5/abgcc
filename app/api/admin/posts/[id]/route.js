import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const oldPost = await prisma.post.findUnique({ where: { id } });

    if (!oldPost) {
      return Response.json({ message: "Article not found." }, { status: 404 });
    }

    const body = await request.json();
    const { title, excerpt, content, coverImage, author, published, featured } =
      body;

    // Keep slug stable unless the title changed
    let slug = oldPost.slug;
    if (title && createSlug(title) !== oldPost.slug) {
      const baseSlug = createSlug(title);
      const clash = await prisma.post.findFirst({
        where: { slug: baseSlug, NOT: { id } },
      });
      slug = clash ? `${baseSlug}-${Date.now()}` : baseSlug;
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        author: author || null,
        published: Boolean(published),
        featured: Boolean(featured),
      },
    });

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    revalidatePath(`/news/${oldPost.slug}`);
    revalidatePath(`/news/${post.slug}`);

    return Response.json({ message: "Article updated successfully.", post });
  } catch (error) {
    console.error("UPDATE_POST_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return Response.json({ message: "Article not found." }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    revalidatePath(`/news/${post.slug}`);

    return Response.json({ message: "Article deleted successfully." });
  } catch (error) {
    console.error("DELETE_POST_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
