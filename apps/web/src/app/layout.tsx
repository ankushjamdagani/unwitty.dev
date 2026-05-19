import React from "react";
import type { Metadata } from "next";
import { JetBrains_Mono, Instrument_Serif } from "next/font/google";
// import { CursorInverted } from "@/components/CursorInveted";
import { Cursor } from "@/components/Cursor";
// import { CursorDisplacementFire } from "@/components/CursorDisplacementFire";
// import { CursorWind } from "@/components/CursorWind";
// import { NoiseOverlay } from "@/components/NoiseOverlay";

import "./_styles/globals.css";
import { LevaDebugger } from "@/components/LevaDebugger";

// const font = Montserrat({
//   subsets: ["latin"],
//   variable: "--font-montserrat",
// });

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mono-display",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-display",
});

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
      <link rel="icon" href="/images/favicon.png" sizes="any" />
      <body
        className={`${jetbrains.variable} ${instrument.variable} font-mono-display`}
      >
        <div className="grain-overlay" />
        {children}
        <Cursor />
        {/* <CursorInverted /> */}

        {/* <NoiseOverlay /> */}
        <React.Suspense fallback={null}>
          <LevaDebugger />
        </React.Suspense>
      </body>
    </html>
  );
}
