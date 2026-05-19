import React from "react";
import type { Metadata } from "next";

import "../_styles/globals.css";
import { Footer } from "../_components/Footer";
import { Nav } from "../_components/Nav";
import { NavVariant } from "../_components/Nav/variants";

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
    <div className="font-serif-display">
      <Nav variant={NavVariant.LIFE} />
      {children}
      <Footer />
    </div>
  );
}
