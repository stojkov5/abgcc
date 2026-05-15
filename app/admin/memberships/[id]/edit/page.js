
export const dynamic = "force-dynamic";
export const revalidate = 0;import { prisma } from "@/lib/prisma";
import EditMembershipForm from "@/components/EditMembershipForm";

export default async function EditMembershipTierPage({ params }) {
  const { id } = await params;

  const tier = await prisma.membershipTier.findUnique({
    where: {
      id,
    },
  });

  if (!tier) {
    return (
      <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
        <section className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">Membership tier not found.</h1>
        </section>
      </main>
    );
  }

  return <EditMembershipForm tier={tier} />;
}