export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Members Directory",
  description:
    "Browse the members of the American Balkan Global Chamber of Commerce — a network of business leaders, investors, and organizations across the US and the Balkans.",
  alternates: { canonical: "/members" },
  openGraph: {
    title: "Members Directory | ABGCC",
    description:
      "Browse the ABGCC member network — business leaders, investors, and organizations.",
    url: "/members",
  },
};

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MembersDirectory from "@/components/MembersDirectory";
import MembersOnlyGate from "@/components/MembersOnlyGate";

export default async function MembersPage() {
  const now = new Date();

  // Gate: must be logged in, and must be a member (or admin)
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const isAdmin = session.user?.role === "SUPER_ADMIN";

  let hasMembership = false;
  if (!isAdmin) {
    const active = await prisma.membership.findFirst({
      where: {
        user: { email: session.user.email },
        status: "ACTIVE",
        endDate: { gt: now },
      },
      select: { id: true },
    });
    hasMembership = Boolean(active);
  }

  if (!isAdmin && !hasMembership) {
    return <MembersOnlyGate />;
  }

  const users = await prisma.user.findMany({
    where: {
      memberships: {
        some: { status: "ACTIVE", endDate: { gt: now } },
      },
    },
    select: {
      id: true,
      name: true,
      organization: true,
      position: true,
      photo: true,
      memberships: {
        where: { status: "ACTIVE", endDate: { gt: now } },
        select: { tier: { select: { title: true } } },
        orderBy: { endDate: "desc" },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });

  // Only expose what a public directory should show — no email/phone.
  const members = users.map((u) => ({
    id: u.id,
    name: u.name || "ABGCC Member",
    organization: u.organization || "",
    position: u.position || "",
    photo: u.photo || null,
    tier: u.memberships[0]?.tier?.title || "Member",
  }));

  return <MembersDirectory members={members} />;
}
