// Centralised admin-notification routing.
//
// Each category goes to its own address. Any variable may hold MULTIPLE
// addresses separated by commas or semicolons, e.g.
//   MEMBERSHIP_EMAIL="eliza@abgcc.org, info@abgcc.org"
// and every listed address receives that notification.
//
// While testing, set TEST_NOTIFICATION_EMAIL to also receive a copy of
// EVERYTHING — then simply remove that one env var when you're done testing.
//
//   CONTACT_EMAIL     → contact form
//   EVENTS_EMAIL      → event registrations
//   MEMBERSHIP_EMAIL  → membership payments & bank-transfer requests

// Expands each value into individual addresses (splitting on "," or ";"),
// trims them, drops blanks, and de-duplicates the final list.
function uniq(list) {
  const expanded = list
    .filter((x) => x && String(x).trim() !== "")
    .flatMap((x) => String(x).split(/[,;]/))
    .map((x) => x.trim())
    .filter((x) => x !== "");

  return [...new Set(expanded)];
}

const test = () => process.env.TEST_NOTIFICATION_EMAIL;
const fallback = () => process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;

export function contactRecipients() {
  return uniq([process.env.CONTACT_EMAIL || fallback(), test()]);
}

export function eventRecipients() {
  return uniq([process.env.EVENTS_EMAIL || fallback(), test()]);
}

export function membershipRecipients() {
  return uniq([process.env.MEMBERSHIP_EMAIL || fallback(), test()]);
}

// New-account signups. Defaults to the membership address (falls back further
// to ADMIN_EMAIL / EMAIL_FROM); set SIGNUP_EMAIL to route them elsewhere.
export function signupRecipients() {
  return uniq([
    process.env.SIGNUP_EMAIL || process.env.MEMBERSHIP_EMAIL || fallback(),
    test(),
  ]);
}
