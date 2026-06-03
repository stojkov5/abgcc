// ABGCC bank details for bank-transfer membership payments.
//
// These are read from environment variables so the real details can be added
// at launch WITHOUT any code changes. Until then, clearly-labelled placeholders
// are shown so the whole flow can be built and tested.
//
// Set these in .env (and on Vercel) when ABGCC provides them:
//   BANK_NAME, BANK_ACCOUNT_NAME, BANK_IBAN, BANK_SWIFT, BANK_ADDRESS, BANK_NOTE

export function getBankDetails() {
  return {
    bankName:    process.env.BANK_NAME        || "[ABGCC BANK NAME — TBD]",
    accountName: process.env.BANK_ACCOUNT_NAME || "American Balkan Global Chamber of Commerce",
    iban:        process.env.BANK_IBAN        || "[IBAN — TBD]",
    swift:       process.env.BANK_SWIFT       || "[SWIFT/BIC — TBD]",
    address:     process.env.BANK_ADDRESS     || "[BANK ADDRESS — TBD]",
    note:        process.env.BANK_NOTE        || "Please include your invoice reference in the payment description.",
  };
}
