import "./globals.css";

import { Cormorant_Garamond } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import SmoothScroll from "@/components/SmoothScroll";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://abgcc.org";

export const metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "ABGCC — American Balkan Global Chamber of Commerce",
    template: "%s | ABGCC",
  },

  description:
    "ABGCC strengthens commercial relationships, strategic partnerships, and economic collaboration between the United States, the Balkans, and global markets.",

  keywords: [
    "American Balkan Global Chamber of Commerce",
    "ABGCC",
    "Balkans business",
    "US-Balkan trade",
    "Balkan investment",
    "chamber of commerce",
    "business networking",
    "Balkans economy",
    "American Balkan relations",
    "trade partnership",
  ],

  authors: [{ name: "ABGCC", url: baseUrl }],
  creator: "ABGCC",
  publisher: "American Balkan Global Chamber of Commerce",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "ABGCC",
    title: "ABGCC — American Balkan Global Chamber of Commerce",
    description:
      "ABGCC strengthens commercial relationships, strategic partnerships, and economic collaboration between the United States, the Balkans, and global markets.",
    images: [
      {
        url: "/abgcc.webp",
        width: 1200,
        height: 630,
        alt: "ABGCC — American Balkan Global Chamber of Commerce",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ABGCC — American Balkan Global Chamber of Commerce",
    description:
      "Strengthening commercial relationships and strategic partnerships between the United States, the Balkans, and global markets.",
    images: ["/abgcc.webp"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },

  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body className="bg-black text-white">
        <SmoothScroll />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
