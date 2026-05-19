import React from "react";
import type { Metadata } from "next";

import "../_styles/globals.css";
import { Nav } from "../_components/Nav";
import { NavVariant } from "../_components/Nav/variants";
import { Footer } from "../_components/Footer";

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
      <Nav variant={NavVariant.WORK} />
      {children}
      <Footer />
    </>
  );
}
