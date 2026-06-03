import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, coverImage, author, published, featured } =
      body;

    if (!title || !content) {
      return Response.json(
        { message: "Title and content are required." },
        { status: 400 }
      );
    }

    const baseSlug = createSlug(title);
    const existing = await prisma.post.findUnique({ where: { slug: baseSlug } });
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        author: author || null,
        published: published === undefined ? true : Boolean(published),
        featured: Boolean(featured),
      },
    });

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    revalidatePath(`/news/${post.slug}`);

    return Response.json({ message: "Article created successfully.", post });
  } catch (error) {
    console.error("CREATE_POST_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
