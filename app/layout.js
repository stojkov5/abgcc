import "./globals.css";

import { Outfit, Manrope } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "ABGCC",
  description: "American Balkan Global Chamber of Commerce",
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${manrope.variable}`}
    >
      <body className="bg-black text-white">
        <SmoothScroll />

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}