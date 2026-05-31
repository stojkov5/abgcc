export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { Reveal } from "@/components/MotionReveal";
import "@/styles/portal.css";

export default async function SecurityPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { emailVerified: true },
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
          <h1 className="portal-title">Security</h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="portal-text">
            Manage your account security settings.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <ChangePasswordForm emailVerified={user.emailVerified} />
        </Reveal>
      </div>
    </main>
  );
}
