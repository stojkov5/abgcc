import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECTIONS = ["TEAM", "ADVISORY"];

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return Response.json({ message: "Team member not found." }, { status: 404 });
    }

    const body = await request.json();

    const {
      name,
      role,
      image,
      bio,
      linkedin,
      section,
      imagePosition,
      visible,
      order,
    } = body;

    if (!name || !role || !image) {
      return Response.json(
        { message: "Name, role, and image are required." },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: name.trim(),
        role: role.trim(),
        image,
        bio: bio?.trim() ? bio.trim() : null,
        linkedin: linkedin?.trim() ? linkedin.trim() : null,
        section: SECTIONS.includes(section) ? section : existing.section,
        imagePosition: imagePosition?.trim() || "center top",
        visible: Boolean(visible),
        order: Number.isFinite(Number(order)) ? Number(order) : existing.order,
      },
    });

    revalidatePath("/about");
    revalidatePath("/admin/team");

    return Response.json({
      message: "Team member updated successfully.",
      member,
    });
  } catch (error) {
    console.error("UPDATE_TEAM_ERROR:", error);
    return Response.json(
      { message: error?.message || "Could not update team member." },
      { status: 500 }
    );
  }
}

// Lightweight partial update — used by the list page's Show/Hide toggle.
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return Response.json({ message: "Team member not found." }, { status: 404 });
    }

    const body = await request.json();
    const data = {};

    if (typeof body.visible === "boolean") data.visible = body.visible;
    if (Number.isFinite(Number(body.order))) data.order = Number(body.order);

    const member = await prisma.teamMember.update({ where: { id }, data });

    revalidatePath("/about");
    revalidatePath("/admin/team");

    return Response.json({ message: "Team member updated.", member });
  } catch (error) {
    console.error("PATCH_TEAM_ERROR:", error);
    return Response.json(
      { message: error?.message || "Could not update team member." },
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

    const existing = await prisma.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return Response.json({ message: "Team member not found." }, { status: 404 });
    }

    await prisma.teamMember.delete({ where: { id } });

    revalidatePath("/about");
    revalidatePath("/admin/team");

    return Response.json({ message: "Team member deleted successfully." });
  } catch (error) {
    console.error("DELETE_TEAM_ERROR:", error);
    return Response.json(
      { message: error?.message || "Could not delete team member." },
      { status: 500 }
    );
  }
}
