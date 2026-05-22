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
    { name: "Membership", href: "/membership" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" },
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

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setProfileDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

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
            <div
              className="navbar-profile-wrapper"
              ref={dropdownRef}
            >
              <button
                onClick={() =>
                  setProfileDropdown(!profileDropdown)
                }
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
                      {session?.user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "M"}
                    </span>
                  )}
                </div>

                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {profileDropdown && (
                  <motion.div
                    className="navbar-profile-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="/portal"
                      className="navbar-dropdown-item"
                      onClick={() =>
                        setProfileDropdown(false)
                      }
                    >
                      Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="navbar-dropdown-item"
                        onClick={() =>
                          setProfileDropdown(false)
                        }
                      >
                        Admin
                      </Link>
                    )}

                    <button
                      onClick={() =>
                        signOut({ callbackUrl: "/" })
                      }
                      className="navbar-dropdown-item logout"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link href="/login" className="navbar-primary-btn">
                Login
              </Link>
            </motion.div>
          )}
        </div>

        <motion.button
          onClick={() => setMobileMenu(!mobileMenu)}
          className={`navbar-mobile-toggle ${
            mobileMenu ? "open" : ""
          }`}
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
                <>
                  <Link
                    href="/portal"
                    className="navbar-mobile-secondary"
                    onClick={() => setMobileMenu(false)}
                  >
                    Profile
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
                    onClick={() => {
                      setMobileMenu(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="navbar-mobile-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link
                    href="/login"
                    className="navbar-mobile-primary"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}