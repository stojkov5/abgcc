export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditProfileForm from "@/components/EditProfileForm";

import { Reveal } from "@/components/MotionReveal";

import "@/styles/portal.css";

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="portal-page">
      <div className="portal-container">
        <Reveal>
          <p className="portal-eyebrow">Member Portal</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="portal-title">
            Complete your profile.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="portal-text">
            Add your organization, professional role, contact details,
            biography, and profile information.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <EditProfileForm user={user} />
        </Reveal>
      </div>
    </main>
  );
}