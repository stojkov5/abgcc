import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminMembershipsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const tiers = await prisma.membershipTier.findMany({
    orderBy: {
      price: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
              Admin
            </p>

            <h1 className="text-4xl font-bold md:text-6xl">
              Membership Tiers
            </h1>
          </div>

          <a
            href="/admin/memberships/new"
            className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Add New Tier
          </a>
        </div>

        <div className="grid gap-6">
          {tiers.map((tier) => (
            <article
              key={tier.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{tier.title}</h2>

                  <p className="mt-2 text-white/60">
                    ${tier.price.toLocaleString()} / {tier.period}
                  </p>

                  <p className="mt-4 max-w-3xl leading-7 text-white/70">
                    {tier.description}
                  </p>

                  <p className="mt-4 text-sm">
                    Status:{" "}
                    <span
                      className={
                        tier.active ? "text-green-300" : "text-red-300"
                      }
                    >
                      {tier.active ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>

                <a
                  href={`/admin/memberships/${tier.id}/edit`}
                  className="rounded-full border border-white/20 px-5 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Edit
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}