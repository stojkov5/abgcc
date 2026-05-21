export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import EditEventForm from "@/components/EditEventForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  HeroReveal,
  HeroItem,
} from "@/components/MotionReveal";

import "../../../../../styles/admin.css";

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
    bookings: {
      orderBy: {
        createdAt: "desc",
      },
    },
  },
});

  if (!event) {
    return (
      <main className="admin-page">
        <section className="admin-form-shell">
          <div className="admin-form-card">
            <Link href="/admin/events" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Events
            </Link>

            <p className="admin-eyebrow">Admin</p>

            <h1 className="admin-form-title">
              Event not found.
            </h1>

            <p className="admin-form-text">
              This event may have been deleted or the link may be incorrect.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-form-shell wide">
        <HeroReveal className="admin-form-card">
          <HeroItem>
            <Link href="/admin/events" className="admin-back-link">
              <ArrowLeft size={16} />
              Back to Events
            </Link>
          </HeroItem>

          <HeroItem as="p" className="admin-eyebrow">
            Admin
          </HeroItem>

          <HeroItem as="h1" className="admin-form-title">
            Edit Event
          </HeroItem>

          <HeroItem as="p" className="admin-form-text">
            Update event details, hero image, gallery images, publishing status,
            and featured visibility.
          </HeroItem>

          <HeroItem>
            <EditEventForm event={event} />
          </HeroItem>
        </HeroReveal>
      </section>
    </main>
  );
}