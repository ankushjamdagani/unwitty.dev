import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CursorInverted } from "@/components/CursorInveted";
import { CursorDisplacementFire } from "@/components/CursorDisplacementFire";

import "./globals.css";
import { CursorWind } from "@/components/CursorWind";
import { LevaDebugger } from "@/components/LevaDebugger";
import { Nav } from "./_components/Nav";
import { Footer } from "./_components/Footer";
import { Cursor } from "@/components/Cursor";

// Inter is a variable font. Don't need weights
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unwitty Dev",
  description: "Personal portfolio for Ankush Jamdagani aka Unwitty Dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} monos`}>
        <Nav />
        {children}
        {/* <CursorInverted /> */}
        {/* <CursorDisplacementFire /> */}
        {/* <CursorWind /> */}
        <Footer />

        {/* <Cursor /> */}
        <LevaDebugger />
      </body>
    </html>
  );
}
