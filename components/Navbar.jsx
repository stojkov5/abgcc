/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { data: session, status } = useSession();

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Membership", href: "/membership" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" },
  ];

  const isLoggedIn = status === "authenticated";

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="text-2xl font-bold tracking-tight text-white">
          ABGCC
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              {link.name}
            </a>
          ))}

          {isLoggedIn ? (
            <>
              <a
                href="/portal"
                className="text-sm font-medium text-white/70 transition hover:text-white"
              >
                Portal
              </a>

              {session?.user?.role === "SUPER_ADMIN" && (
                <a
                  href="/admin"
                  className="text-sm font-medium text-white/70 transition hover:text-white"
                >
                  Admin
                </a>
              )}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-sm font-medium text-white/70 transition hover:text-white"
              >
                Login
              </a>

              <a
                href="/register"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Register
              </a>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="flex items-center justify-center text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {mobileMenu && (
        <div className="border-t border-white/10 bg-black md:hidden">
          <div className="flex flex-col px-6 py-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className="border-b border-white/10 py-4 text-white/80 transition hover:text-white"
              >
                {link.name}
              </a>
            ))}

            {isLoggedIn ? (
              <>
                <a
                  href="/portal"
                  onClick={() => setMobileMenu(false)}
                  className="border-b border-white/10 py-4 text-white/80 transition hover:text-white"
                >
                  Portal
                </a>

                {session?.user?.role === "SUPER_ADMIN" && (
                  <a
                    href="/admin"
                    onClick={() => setMobileMenu(false)}
                    className="border-b border-white/10 py-4 text-white/80 transition hover:text-white"
                  >
                    Admin
                  </a>
                )}

                <button
                  onClick={() => {
                    setMobileMenu(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="py-4 text-left text-white/80 transition hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={() => setMobileMenu(false)}
                  className="border-b border-white/10 py-4 text-white/80 transition hover:text-white"
                >
                  Login
                </a>

                <a
                  href="/register"
                  onClick={() => setMobileMenu(false)}
                  className="py-4 text-white/80 transition hover:text-white"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}