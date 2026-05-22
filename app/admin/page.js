import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { authOptions } from "@/lib/auth";

import {
  HeroReveal,
  HeroItem,
  Stagger,
  StaggerItem,
} from "@/components/MotionReveal";

import "../../styles/admin.css";

const adminCards = [
  {
    number: "01",
    title: "Memberships",
    text: "Manage membership tiers, pricing, descriptions, and active status.",
    href: "/admin/memberships",
  },
  {
    number: "02",
    title: "Events",
    text: "Create, edit, publish, and manage ABGCC business events.",
    href: "/admin/events",
  },
  {
    number: "03",
    title: "Contact Messages",
    text: "Review incoming contact requests, inquiries, and partnership messages.",
    href: "/admin/contact-messages",
  },
  {
    number: "04",
    title: "Users",
    text: "View members, permissions, and account access. Coming soon.",
    href: "/admin/users",
  },
];

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  return (
    <main className="admin-page">
      <section className="admin-container">
        <HeroReveal>
          <HeroItem as="p" className="admin-eyebrow">
            Admin Dashboard
          </HeroItem>

          <HeroItem as="h1" className="admin-title">
            Welcome Admin
          </HeroItem>

          <HeroItem as="p" className="admin-text">
            Manage ABGCC membership tiers, events, users, and operational
            content from one clear dashboard.
          </HeroItem>
        </HeroReveal>

        <Stagger className="admin-grid">
          {adminCards.map((card) =>
            card.href ? (
              <StaggerItem
                as="article"
                key={card.title}
                className="admin-card"
              >
                <Link href={card.href} className="admin-card-link">
                  <span className="admin-card-number">{card.number}</span>

                  <div>
                    <h2>{card.title}</h2>
                    <p>{card.text}</p>
                  </div>

                  <span className="admin-card-action">
                    Open <ArrowRight size={15} />
                  </span>
                </Link>
              </StaggerItem>
            ) : (
              <StaggerItem
                as="article"
                key={card.title}
                className="admin-card disabled"
              >
                <span className="admin-card-number">{card.number}</span>

                <div>
                  <h2>{card.title}</h2>
                  <p>{card.text}</p>
                </div>

                <span className="admin-card-action">Coming Soon</span>
              </StaggerItem>
            )
          )}
        </Stagger>
      </section>
    </main>
  );
}