import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECTIONS = ["TEAM", "ADVISORY"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const members = await prisma.teamMember.findMany({
      orderBy: [{ section: "asc" }, { order: "asc" }, { createdAt: "asc" }],
    });

    return Response.json({ members });
  } catch (error) {
    console.error("LIST_TEAM_ERROR:", error);
    return Response.json(
      { message: error?.message || "Could not load team members." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
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

    const member = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        image,
        bio: bio?.trim() ? bio.trim() : null,
        linkedin: linkedin?.trim() ? linkedin.trim() : null,
        section: SECTIONS.includes(section) ? section : "TEAM",
        imagePosition: imagePosition?.trim() || "center top",
        visible: visible === undefined ? true : Boolean(visible),
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
      },
    });

    revalidatePath("/about");
    revalidatePath("/admin/team");

    return Response.json({
      message: "Team member created successfully.",
      member,
    });
  } catch (error) {
    console.error("CREATE_TEAM_ERROR:", error);
    return Response.json(
      { message: error?.message || "Could not create team member." },
      { status: 500 }
    );
  }
}
