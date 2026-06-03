import crypto from "crypto";

/**
 * Unique, human-readable invoice reference for bank-transfer memberships.
 * Format: ABGCC-INV-XXXXXX
 */
export function generateInvoiceReference() {
  return `ABGCC-INV-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}
