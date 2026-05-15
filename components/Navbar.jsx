"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import "../styles/navbar.css";
import Image from "next/image";
export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "SUPER_ADMIN";

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Membership", href: "/membership" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" },
    ...(isLoggedIn ? [{ name: "Portal", href: "/portal" }] : []),
    ...(isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 80) {
        setHidden(true);
        setMobileMenu(false);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      className="navbar-shell"
      animate={{ y: hidden ? "-120%" : "0%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <nav className="navbar-container">
        <Link href="/" className="navbar-logo rounded-full">
  <Image
    src="/abgcc.webp"
    alt="ABGCC Logo"
    width={160}
    height={60}
    priority
    className="navbar-logo-image"
  />
</Link>

        <div className="navbar-center">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                href={link.href}
                className={`navbar-pill ${
                  pathname === link.href ? "active" : ""
                }`}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="navbar-right">
          {isLoading ? (
            <div className="navbar-loading" />
          ) : isLoggedIn ? (
            <motion.button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="navbar-primary-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Logout
            </motion.button>
          ) : (
            <>
              <Link href="/login" className="navbar-login">
                Login
              </Link>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link href="/register" className="navbar-primary-btn">
                  Register
                </Link>
              </motion.div>
            </>
          )}

          
        </div>

        <motion.button
          onClick={() => setMobileMenu(!mobileMenu)}
          className={`navbar-mobile-toggle ${mobileMenu ? "open" : ""}`}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenu ? <X size={27} /> : <Menu size={27} />}
        </motion.button>
      </nav>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="navbar-mobile-menu"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className={`navbar-mobile-link ${
                  pathname === link.href ? "active" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="navbar-mobile-actions">
              {isLoading ? (
                <div className="navbar-mobile-loading" />
              ) : isLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenu(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="navbar-mobile-primary"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenu(false)}
                    className="navbar-mobile-secondary"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileMenu(false)}
                    className="navbar-mobile-primary"
                  >
                    Register
                  </Link>
                </>
              )}

              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}