// Offset (px) so the fixed navbar doesn't cover scrolled-to content.
// Kept in parity with the scroll-padding-top breakpoints in app/globals.css.
export function getNavOffset() {
  if (typeof window === "undefined") return 120;
  const width = window.innerWidth;
  if (width <= 480) return 84;
  if (width <= 1200) return 96;
  return 120;
}
