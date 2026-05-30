import React from "react";
import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Cormorant_Garamond,
  Italianno,
  Spectral,
} from "next/font/google";
// import { CursorInverted } from "@/components/CursorInveted";
import { Cursor } from "@/components/Cursor";
// import { CursorDisplacementFire } from "@/components/CursorDisplacementFire";
// import { CursorWind } from "@/components/CursorWind";
// import { NoiseOverlay } from "@/components/NoiseOverlay";

import "./_styles/globals.css";
import { LevaDebugger } from "@/components/LevaDebugger";
import { BgVignetteControl } from "./work/_components/BgVignetteControl";

// const font = Montserrat({
//   subsets: ["latin"],
//   variable: "--font-montserrat",
// });

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-technical",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
});

const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-expressive",
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
        className={`${jetbrains.variable} ${spectral.variable} ${cormorant.variable} ${italianno.variable} font-technical`}
      >
        <div className="grain-overlay" />
        {children}
        <Cursor />
        {/* <CursorInverted /> */}

        {/* <NoiseOverlay /> */}
        <React.Suspense fallback={null}>
          <LevaDebugger />
        </React.Suspense>
        <BgVignetteControl />
      </body>
    </html>
  );
}
