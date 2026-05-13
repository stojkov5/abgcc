import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function PortalPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
          Member Portal
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Welcome, {session.user?.name || "Member"}
        </h1>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/70">
            Email: {session.user?.email}
          </p>
        </div>
      </section>
    </main>
  );
}