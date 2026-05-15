export const dynamic = "force-dynamic";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import EditEventForm from "@/components/EditEventForm";

export default async function EditEventPage({ params }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!event) {
    return (
      <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white">
        <section className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">Event not found.</h1>
        </section>
      </main>
    );
  }

  return <EditEventForm event={event} />;
}