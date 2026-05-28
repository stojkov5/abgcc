export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import NewEventForm from "@/components/NewEventForm";

import {
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/AdminUI";

import "@/styles/admin-events.css";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "SUPER_ADMIN") redirect("/");

  return (
    <AdminShell>
      <div className="admin-events-page">
        <Link href="/admin/events" className="admin-events-back-link">
          <ArrowLeft size={16} />
          Back to Events
        </Link>

        <AdminPageHeader
          eyebrow="Admin Panel"
          title="Create Event"
          text="Add a new ABGCC event with image, location, capacity, price, publishing status, and featured visibility."
        />

        <AdminPanel>
          <NewEventForm />
        </AdminPanel>
      </div>
    </AdminShell>
  );
}