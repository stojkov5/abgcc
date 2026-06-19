import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin edit of a member's directory / company profile.
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      organization,
      logo,
      companyDescription,
      website,
      industrySector,
      industryTags,
      keyContactName,
      keyContactTitle,
      keyContactEmail,
      address,
      bannerImage,
      featuredProjects,
      directoryVisible,
    } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        organization: organization || null,
        logo: logo || null,
        companyDescription: companyDescription || null,
        website: website || null,
        industrySector: industrySector || null,
        industryTags: industryTags || null,
        keyContactName: keyContactName || null,
        keyContactTitle: keyContactTitle || null,
        keyContactEmail: keyContactEmail || null,
        address: address || null,
        bannerImage: bannerImage || null,
        featuredProjects: featuredProjects || null,
        directoryVisible:
          directoryVisible === undefined ? true : Boolean(directoryVisible),
      },
    });

    revalidatePath("/members");
    revalidatePath(`/admin/users/${id}`);

    return Response.json({
      message: "Directory profile updated.",
      user: updated,
    });
  } catch (error) {
    console.error("ADMIN_DIRECTORY_UPDATE_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
