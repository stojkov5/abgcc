# Navbar Section Dropdowns — Design

**Date:** 2026-06-12
**Status:** Approved

## Goal

Add dropdown menus to navbar links that have multiple on-page sections. Each
dropdown item links directly to a section and smooth-scrolls there. Clicking the
main nav label still navigates to the top of the page.

## Decisions

- **Scope:** Dropdowns only on links with multiple real sections — **About** and
  **Membership**. Services, Events, News, Contact stay as plain links.
- **Desktop trigger:** Open on hover (also opens on keyboard `:focus-within`).
- **Scroll behavior:** Smooth scroll (consistent with the global
  `scroll-behavior: smooth` and existing `#membership-tiers` / `#events-list`
  links).
- **Mobile:** Accordion — a chevron toggle beside About/Membership expands an
  indented section sub-list; the label itself still navigates to the page.

## Section anchors

IDs added to existing `<section>` elements.

### About (`/about`)

| Section element | New `id` | Dropdown label |
|---|---|---|
| `.about-intro` | `who-we-are` | Who We Are |
| `.industries-section` | `industries` | Industries |
| `.vision-section` | `our-vision` | Our Vision |
| `.team-section` | `meet-the-team` | Meet the Team |
| `.pillars-section` | `core-pillars` | Core Pillars |

### Membership (`/membership`)

| Section element | New `id` | Dropdown label |
|---|---|---|
| `.membership-intro-section` | `membership-overview` | Overview |
| `.membership-value-section` | `membership-value` | Membership Value |
| `.membership-tiers-section` | `membership-tiers` (already present) | Membership Tiers |

## Implementation

### Navbar config (`components/Navbar.jsx`)

Extend `navLinks` so About and Membership carry a `sections` array:

```js
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
}
```

### Desktop dropdown

- Each center link is wrapped in a hover container
  (`onMouseEnter` / `onMouseLeave` → `openDropdown` state keyed by link name).
- Links with `sections` show a rotating `ChevronDown`.
- Dropdown card styled like the existing profile dropdown (white blur, gold
  hover), animated via Framer Motion `AnimatePresence`.
- Items are `<Link href={`${href}#${hash}`}>`.
- Main label `<Link href={href}>` still navigates to page top.
- Opens on `:focus-within` for keyboard access; closes on mouse-leave and on
  route change (`usePathname` effect).

### Mobile accordion

- About/Membership rows split into a label `<Link>` (navigates) plus a chevron
  `<button>` that toggles an indented section sub-list (`mobileExpanded` state).
- Tapping a section link navigates with hash and closes the menu.

### Scroll offset (`app/globals.css`)

The fixed navbar (~100px tall) would otherwise hide section headings under it:

```css
section[id] { scroll-margin-top: 120px; }
@media (max-width: 1200px) { section[id] { scroll-margin-top: 90px; } }
```

## Files touched

- `components/Navbar.jsx`
- `components/SmoothScroll.jsx` (exposes the Lenis instance — see below)
- `styles/navbar.css`
- `app/(website)/about/page.js`
- `app/(website)/membership/page.js`
- `app/globals.css`

## Lenis integration (discovered during implementation)

The site uses Lenis (`components/SmoothScroll.jsx`) which hijacks the scroll
loop, so native `scroll-padding-top` / `scrollIntoView` are not reliable for
section navigation. Section links therefore drive Lenis explicitly:

- `SmoothScroll` exposes the instance as `window.lenis`.
- The navbar's `handleSectionClick` calls `e.preventDefault()` and, for the
  current page, scrolls via Lenis to a **numeric** target computed as
  `element.top + scrollY - navOffset`. A numeric target is used deliberately:
  for string/element targets Lenis also subtracts the CSS `scroll-padding-top`,
  which would stack with our offset and double it. `navOffset` lives in
  `lib/scroll.js` (`getNavOffset`) and is kept in parity with the
  `scroll-padding-top` breakpoints (120 / 96 / 84).
- For a different page it queues the hash, calls
  `router.push(href, { scroll: false })` (so Next's scroll-to-top doesn't fight
  Lenis), then polls for the target element on route change and scrolls once it
  exists (pages may stream a `loading.js` state first).
- Before each `scrollTo`, `lenis.resize()` is called because Lenis's scroll
  limit can still be stale (0) right after a client navigation, which would
  otherwise clamp the target to the top.
- `scroll-padding-top` is retained for native fallbacks (e.g. loading a URL that
  already contains a hash).

## Notes

- The existing scroll handler hides the navbar on scroll-down, so after clicking
  a section the navbar tucks away as the page scrolls to it (reappears on
  scroll-up). Expected; left as-is.
