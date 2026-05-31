import "./globals.css";

import { Cormorant_Garamond } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "ABGCC",
  description: "American Balkan Global Chamber of Commerce",
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={cormorant.variable}
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