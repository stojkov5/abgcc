export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/AdminShell";
import EditEventForm from "@/components/EditEventForm";

import {
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/AdminUI";

import "@/styles/admin.css";
import "@/styles/admin-events.css";

export default async function EditEventPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

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

  if (!event) notFound();

  return (
    <AdminShell>
      <div className="admin-events-page">
        <Link href="/admin/events" className="admin-events-back-link">
          <ArrowLeft size={16} />
          Back to Events
        </Link>

        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Edit Event"
          text="Update event details, hero image, gallery images, publishing status, and featured visibility."
        />

        <AdminPanel>
          <EditEventForm event={event} />
        </AdminPanel>
      </div>
    </AdminShell>
  );
}