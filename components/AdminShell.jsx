"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BadgeDollarSign,
  Mail,
  LogOut,
  Menu,
  X,
  Home,
  QrCode,
} from "lucide-react";
import { useState } from "react";
import "@/styles/admin-layout.css";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Check-in",
    href: "/admin/checkin",
    icon: QrCode,
  },
  {
    label: "Memberships",
    href: "/admin/memberships",
    icon: BadgeDollarSign,
  },
  {
    label: "Messages",
    href: "/admin/contact-messages",
    icon: Mail,
  },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-shell">
      <button
        type="button"
        className="admin-mobile-menu-btn"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
        Menu
      </button>

      <div
        className={`admin-sidebar-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <button
          type="button"
          className="admin-sidebar-close"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>

        <Link href="/admin" className="admin-sidebar-brand">
          <span>A</span>

          <div>
            <strong>ABGCC</strong>
            <small>Admin System</small>
          </div>
        </Link>

        <Link href="/" className="admin-sidebar-website-link">
          <Home size={16} />
          Back to Website
        </Link>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`admin-sidebar-link ${active ? "active" : ""}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="admin-sidebar-logout"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-content-shell">{children}</div>
      </main>
    </div>
  );
}