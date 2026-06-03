import crypto from "crypto";

/**
 * Generates a unique, human-readable ticket reference.
 * Format: ABGCC-XXXXXXXX (8 uppercase hex chars)
 */
export function generateReference() {
  return `ABGCC-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

/**
 * The URL encoded inside the QR code. Scanning it (by an admin) opens the
 * check-in page pre-filled with this booking's reference.
 */
export function checkinUrl(reference) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://abgcc.org";
  return `${base}/admin/checkin?ref=${encodeURIComponent(reference)}`;
}

/**
 * Public URL of the QR PNG for a given reference (used as <img src> in emails).
 */
export function qrImageUrl(reference) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://abgcc.org";
  return `${base}/api/tickets/${encodeURIComponent(reference)}/qr`;
}
