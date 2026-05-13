import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
          Admin Dashboard
        </p>

        <h1 className="mb-10 text-4xl font-bold md:text-6xl">
          Welcome Admin
        </h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">Memberships</h2>
            <p className="text-white/70">
              Manage membership tiers and pricing.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">Events</h2>
            <p className="text-white/70">
              Create and manage business events.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">Users</h2>
            <p className="text-white/70">
              View members and permissions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}