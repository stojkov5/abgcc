"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import "../styles/navbar.css";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "SUPER_ADMIN";

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Membership", href: "/membership" },
    { name: "Events", href: "/events" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);
      if (currentY > lastScrollY && currentY > 80) {
        setHidden(true);
        setMobileMenu(false);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      className="navbar-shell"
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: hidden ? "-120%" : "0%", opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className={`navbar-container ${scrolled ? "scrolled" : ""}`}>

        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <Image
            src="/abgcc.webp"
            alt="ABGCC"
            width={160}
            height={60}
            priority
            className="navbar-logo-image"
          />
          <span className="navbar-logo-divider" aria-hidden="true" />
        </Link>

        {/* Desktop links */}
        <div className="navbar-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`navbar-link ${isActive ? "active" : ""}`}
              >
                {link.name}
                <span className="navbar-link-line" />
              </Link>
            );
          })}
        </div>

        {/* Desktop right */}
        <div className="navbar-right">
          {isLoading ? (
            <div className="navbar-loading" />
          ) : isLoggedIn ? (
            <div className="navbar-profile-wrapper" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="navbar-profile-trigger"
              >
                <div className="navbar-avatar">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      fill
                      className="navbar-avatar-img"
                    />
                  ) : (
                    <span>
                      {session?.user?.name?.charAt(0)?.toUpperCase() || "M"}
                    </span>
                  )}
                </div>
                <motion.span
                  animate={{ rotate: profileDropdown ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ display: "flex", color: "rgba(16,36,63,0.5)" }}
                >
                  <ChevronDown size={15} />
                </motion.span>
              </button>

              <AnimatePresence>
                {profileDropdown && (
                  <motion.div
                    className="navbar-profile-dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href="/portal"
                      className="navbar-dropdown-item"
                      onClick={() => setProfileDropdown(false)}
                    >
                      My Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="navbar-dropdown-item"
                        onClick={() => setProfileDropdown(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <div className="navbar-dropdown-divider" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="navbar-dropdown-item logout"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="navbar-cta-btn">
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <motion.button
          onClick={() => setMobileMenu(!mobileMenu)}
          className={`navbar-mobile-toggle ${mobileMenu ? "open" : ""}`}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.88 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileMenu ? "close" : "open"}
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex" }}
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="navbar-mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="navbar-mobile-links">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenu(false)}
                    className={`navbar-mobile-link ${pathname === link.href ? "active" : ""}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="navbar-mobile-divider" />

            <div className="navbar-mobile-actions">
              {isLoading ? (
                <div className="navbar-mobile-loading" />
              ) : isLoggedIn ? (
                <>
                  <Link
                    href="/portal"
                    className="navbar-mobile-secondary"
                    onClick={() => setMobileMenu(false)}
                  >
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="navbar-mobile-secondary"
                      onClick={() => setMobileMenu(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { setMobileMenu(false); signOut({ callbackUrl: "/" }); }}
                    className="navbar-mobile-logout"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="navbar-mobile-primary"
                  onClick={() => setMobileMenu(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
