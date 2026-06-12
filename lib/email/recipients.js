// Centralised admin-notification routing.
//
// Each category goes to its own address. While testing, set
// TEST_NOTIFICATION_EMAIL to also receive a copy of EVERYTHING — then simply
// remove that one env var when you're done testing.
//
//   CONTACT_EMAIL     → contact form
//   EVENTS_EMAIL      → event registrations
//   MEMBERSHIP_EMAIL  → membership payments & bank-transfer requests

function uniq(list) {
  return [...new Set(list.filter((x) => x && String(x).trim() !== ""))];
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
