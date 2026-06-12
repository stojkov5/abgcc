// ABGCC bank details for bank-transfer membership payments.
//
// Read from environment variables so details can change without code edits.
// Any field left empty is automatically hidden on the invoice, so the same
// setup supports US accounts (Account Number + Routing Number), international
// transfers (SWIFT), and European accounts (IBAN) — fill in whatever applies.
//
// Set in .env (and on Vercel):
//   BANK_NAME, BANK_ACCOUNT_NAME, BANK_ACCOUNT_NUMBER, BANK_ROUTING_NUMBER,
//   BANK_SWIFT, BANK_IBAN, BANK_ADDRESS, BANK_NOTE

export function getBankDetails() {
  return {
    bankName:      process.env.BANK_NAME || "",
    accountName:   process.env.BANK_ACCOUNT_NAME || "American Balkan Global Chamber of Commerce",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
    routingNumber: process.env.BANK_ROUTING_NUMBER || "",
    swift:         process.env.BANK_SWIFT || "",
    iban:          process.env.BANK_IBAN || "",
    address:       process.env.BANK_ADDRESS || "",
    note:          process.env.BANK_NOTE || "Please include your invoice reference in the payment description.",
  };
}

// Returns [{ label, value }] for every populated bank field, in display order.
export function bankDetailRows(bank) {
  return [
    { label: "Bank", value: bank.bankName },
    { label: "Account Name", value: bank.accountName },
    { label: "Account Number", value: bank.accountNumber },
    { label: "Routing Number", value: bank.routingNumber },
    { label: "SWIFT / BIC", value: bank.swift },
    { label: "IBAN", value: bank.iban },
    { label: "Bank Address", value: bank.address },
  ].filter((row) => row.value && row.value.trim() !== "");
}
