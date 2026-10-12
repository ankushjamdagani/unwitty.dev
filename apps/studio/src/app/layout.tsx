import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";

import { profile } from "@/config/profile";

import { Footer } from "./_components/Footer";
import { Nav } from "./_components/Nav";

import "./_styles/globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
// Product tagline fonts. Add new ones here and reference them from products.ts.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${profile.site}`),
  title: { default: `${profile.site} — ${profile.name}`, template: `%s — ${profile.site}` },
  description: `${profile.headline} Software by ${profile.name}.`,
  icons: { icon: "/images/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${newsreader.variable}`}>
      <body>
        <Nav />
        <main className="container-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
