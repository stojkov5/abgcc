import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();

    const {
      name,
      organization,
      position,
      phone,
      bio,
      photo,
      // Directory / company profile fields
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

    if (!name) {
      return Response.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
        organization: organization || null,
        position: position || null,
        phone: phone || null,
        bio: bio || null,
        photo: photo || null,
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
        profileCompleted: true,
      },
    });

    revalidatePath("/members");

    revalidatePath("/portal");
    revalidatePath("/portal/profile");

    return Response.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}