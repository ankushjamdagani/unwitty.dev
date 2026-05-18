import React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "../_styles/globals.css";
import { Footer } from "../_components/Footer";
import { Nav } from "../_components/Nav2";

// Inter is a variable font. Don't need weights
// const font = Inter({ subsets: ["latin"] });
const font = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unwitty Dev",
  description: "Personal portfolio for Ankush Jamdagani aka Unwitty Dev",
};

export default function LifeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
