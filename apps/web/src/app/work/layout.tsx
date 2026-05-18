import React from "react";
import type { Metadata } from "next";

import { CursorInverted } from "@/components/CursorInveted";
// import { CursorDisplacementFire } from "@/components/CursorDisplacementFire";

import "../_styles/globals.css";
// import { CursorWind } from "@/components/CursorWind";
import { LevaDebugger } from "@/components/LevaDebugger";
import { Nav } from "../_components/Nav";
import { Footer } from "../_components/Footer";
import { Cursor } from "@/components/Cursor";
import { NoiseOverlay } from "@/components/NoiseOverlay";

export const metadata: Metadata = {
  title: "Unwitty Dev",
  description: "Personal portfolio for Ankush Jamdagani aka Unwitty Dev",
};

export default function WorkRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
      <CursorInverted />
      {/* <CursorDisplacementFire /> */}
      {/* <CursorWind /> */}
      <Footer />

      <Cursor />
      <NoiseOverlay />

      <React.Suspense fallback={null}>
        <LevaDebugger />
      </React.Suspense>
    </>
  );
}
