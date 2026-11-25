import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-syne",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TonkJet — Private Jet Charter Worldwide",
  description:
    "TonkJet is a private aviation operator offering ultra-long-range global charter missions with quiet luxury, precision, and 24/7 flight readiness.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased bg-[#050505] text-[#FFF8ED] selection:bg-[#FFF8ED] selection:text-[#141010]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
