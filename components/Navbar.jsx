"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import "../styles/navbar.css";
import Image from "next/image";
import { getNavOffset } from "@/lib/scroll";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const dropdownRef = useRef(null);
  const pendingHashRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "SUPER_ADMIN";

  const navLinks = [
    {
      name: "About",
      href: "/about",
      sections: [
        { label: "Who We Are", hash: "who-we-are" },
        { label: "Industries", hash: "industries" },
        { label: "Our Vision", hash: "our-vision" },
        { label: "Meet the Team", hash: "meet-the-team" },
        { label: "Core Pillars", hash: "core-pillars" },
      ],
    },
    { name: "Services", href: "/services" },
    {
      name: "Membership",
      href: "/membership",
      sections: [
        { label: "Overview", hash: "membership-overview" },
        { label: "Membership Value", hash: "membership-value" },
        { label: "Membership Tiers", hash: "membership-tiers" },
        { label: "Benefits Comparison", hash: "membership-comparison" },
        { label: "Members Directory", href: "/members" },
      ],
    },
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

  // Smooth-scroll to a section. Lenis owns the scroll loop, so a native
  // scrollIntoView would be fought by it — drive lenis.scrollTo instead,
  // falling back to native only if Lenis isn't ready.
  //
  // We pass a numeric target (not the hash string) on purpose: for string /
  // element targets Lenis also subtracts the CSS scroll-padding-top, which
  // would stack with our offset and double it. A numeric target applies only
  // the offset we compute, so the section lands exactly below the navbar.
  const scrollToHash = (hash) => {
    const el = typeof document !== "undefined" ? document.querySelector(hash) : null;
    if (!el) return;

    const lenis = typeof window !== "undefined" ? window.lenis : null;
    if (lenis) {
      // Recalculate Lenis dimensions first — after a client navigation its
      // scroll limit can still be stale (0), which would clamp the target.
      lenis.resize();
      const target = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
      lenis.scrollTo(target);
    } else {
      el.scrollIntoView();
    }
  };

  const closeMenus = () => {
    setOpenDropdown(null);
    setMobileMenu(false);
    setMobileExpanded(null);
    setProfileDropdown(false);
  };

  const handleSectionClick = (e, href, sectionHash) => {
    const hash = `#${sectionHash}`;
    closeMenus();

    e.preventDefault();
    if (pathname === href) {
      // Already on the page — scroll directly.
      scrollToHash(hash);
    } else {
      // Different page — navigate first, then scroll once it renders.
      // scroll:false stops Next's default scroll-to-top from fighting the
      // Lenis scroll we run when the destination section appears.
      pendingHashRef.current = hash;
      router.push(href, { scroll: false });
    }
  };

  // After a cross-page section link navigates, scroll to the queued section
  // once the destination page has rendered. Pages may stream a loading state
  // first (loading.js) and fetch data, so poll for the target element rather
  // than assuming it exists immediately.
  useEffect(() => {
    if (!pendingHashRef.current) return;
    const hash = pendingHashRef.current;
    pendingHashRef.current = null;

    let cancelled = false;
    let attempts = 0;
    const tryScroll = () => {
      if (cancelled) return;
      if (document.querySelector(hash)) {
        scrollToHash(hash);
      } else if (attempts < 40) {
        attempts += 1;
        window.setTimeout(tryScroll, 50); // retry for up to ~2s
      }
    };
    const start = window.setTimeout(tryScroll, 50);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
  }, [pathname]);

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
            const hasSections =
              Array.isArray(link.sections) && link.sections.length > 0;
            const isOpen = openDropdown === link.name;

            return (
              <div
                key={link.name}
                className="navbar-item"
                onMouseEnter={() => hasSections && setOpenDropdown(link.name)}
                onMouseLeave={() => hasSections && setOpenDropdown(null)}
                onFocus={() => hasSections && setOpenDropdown(link.name)}
                onBlur={(e) => {
                  if (
                    hasSections &&
                    !e.currentTarget.contains(e.relatedTarget)
                  ) {
                    setOpenDropdown(null);
                  }
                }}
              >
                <Link
                  href={link.href}
                  className={`navbar-link ${isActive ? "active" : ""}`}
                  aria-haspopup={hasSections ? "true" : undefined}
                  aria-expanded={hasSections ? isOpen : undefined}
                  onClick={() => setOpenDropdown(null)}
                >
                  <span className="navbar-link-label">
                    {link.name}
                    {hasSections && (
                      <motion.span
                        className="navbar-link-chevron"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    )}
                  </span>
                  <span className="navbar-link-line" />
                </Link>

                {hasSections && (
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className="navbar-section-dropdown"
                        initial={{ opacity: 0, y: 6, scale: 0.98, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                        exit={{ opacity: 0, y: 6, scale: 0.98, x: "-50%" }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="navbar-section-dropdown-card">
                          {link.sections.map((section) =>
                            section.href ? (
                              <Link
                                key={section.href}
                                href={section.href}
                                className="navbar-dropdown-item"
                                onClick={closeMenus}
                              >
                                {section.label}
                              </Link>
                            ) : (
                              <Link
                                key={section.hash}
                                href={`${link.href}#${section.hash}`}
                                className="navbar-dropdown-item"
                                onClick={(e) =>
                                  handleSectionClick(e, link.href, section.hash)
                                }
                              >
                                {section.label}
                              </Link>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
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
              {navLinks.map((link, i) => {
                const hasSections =
                  Array.isArray(link.sections) && link.sections.length > 0;
                const isExpanded = mobileExpanded === link.name;

                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {hasSections ? (
                      <div className="navbar-mobile-group">
                        <div className="navbar-mobile-row">
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenu(false)}
                            className={`navbar-mobile-link ${pathname === link.href ? "active" : ""}`}
                          >
                            {link.name}
                          </Link>
                          <button
                            type="button"
                            className={`navbar-mobile-expand ${isExpanded ? "open" : ""}`}
                            aria-label={`Toggle ${link.name} sections`}
                            aria-expanded={isExpanded}
                            onClick={() =>
                              setMobileExpanded(isExpanded ? null : link.name)
                            }
                          >
                            <ChevronDown size={18} />
                          </button>
                        </div>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              className="navbar-mobile-sublist"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            >
                              {link.sections.map((section) =>
                                section.href ? (
                                  <Link
                                    key={section.href}
                                    href={section.href}
                                    onClick={closeMenus}
                                    className="navbar-mobile-sublink"
                                  >
                                    {section.label}
                                  </Link>
                                ) : (
                                  <Link
                                    key={section.hash}
                                    href={`${link.href}#${section.hash}`}
                                    onClick={(e) =>
                                      handleSectionClick(e, link.href, section.hash)
                                    }
                                    className="navbar-mobile-sublink"
                                  >
                                    {section.label}
                                  </Link>
                                )
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenu(false)}
                        className={`navbar-mobile-link ${pathname === link.href ? "active" : ""}`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
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
