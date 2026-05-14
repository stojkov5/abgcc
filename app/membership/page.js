import { prisma } from "@/lib/prisma";

export default async function MembershipPage() {
  const tiers = await prisma.membershipTier.findMany({
    where: {
      active: true,
    },
    orderBy: {
      price: "asc",
    },
  });

  return (
    <main className="min-h-screen px-6 pb-20 pt-32 ">
      <section className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
          Membership
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Choose your membership.
        </h1>

        <p className="mb-12 max-w-3xl text-lg leading-8 text-white/70">
          Join the American Balkan Global Chamber of Commerce and connect with a
          strategic network of business leaders, investors, institutions, and
          entrepreneurs.
        </p>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {tiers.map((tier) => (
            <article
              key={tier.id}
              className="flex min-h-[360px] flex-col rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div>
                <h2 className="mb-4 text-2xl font-bold">
                  {tier.title}
                </h2>

                <p className="mb-6 text-4xl font-bold">
                  ${tier.price.toLocaleString()}
                </p>

                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  {tier.period}
                </p>
              </div>

              <p className="mt-6 flex-1 leading-7 text-white/70">
                {tier.description}
              </p>

              <a
                href="/contact"
                className="mt-8 inline-flex justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Contact Us
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}