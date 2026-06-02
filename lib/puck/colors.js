// Brand color palette for Puck text / heading color fields.
// Values map to the design tokens defined in app/globals.css, so content
// stays in sync with the site theme (gold = --sun-gold, navy = --sky-ink, ...).
//
// Plain JS (no React) so it can be shared by the isomorphic Puck config and
// the client-side ColorField component.

export const COLOR_SWATCHES = [
  { label: "Default (navy)", value: "default", color: "var(--sky-ink)" },
  { label: "Gold", value: "gold", color: "var(--sun-gold)" },
  { label: "Deep gold", value: "gold-deep", color: "var(--gold-main)" },
  { label: "Blue", value: "blue", color: "var(--sky-blue)" },
  { label: "Muted", value: "muted", color: "var(--sky-muted)" },
  { label: "White", value: "white", color: "var(--cloud-white)" },
];

const COLOR_VALUES = {
  default: null,
  navy: "var(--sky-ink)",
  gold: "var(--sun-gold)",
  "gold-deep": "var(--gold-main)",
  blue: "var(--sky-blue)",
  muted: "var(--sky-muted)",
  white: "var(--cloud-white)",
};

// Returns a CSS color value for a stored palette key, or null for "default".
// Falls back to the raw value so any older/custom value still renders.
export function resolveColor(color) {
  if (!color) return null;
  if (color in COLOR_VALUES) return COLOR_VALUES[color];
  return color;
}
