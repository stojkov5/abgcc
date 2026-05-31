export const metadata = {
  title: "Contact",
  description:
    "Get in touch with ABGCC for membership inquiries, partnerships, events, investment opportunities, or general questions about US-Balkan business relations.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact ABGCC",
    description:
      "Reach out for membership, partnerships, events, investment opportunities, or general inquiries about ABGCC.",
    url: "/contact",
  },
};

import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return <ContactForm />;
}
