import React from "react";
import type { Metadata } from "next";

import "../_styles/globals.css";
import { Nav, SectionRail } from "../_components/Nav";
import { Footer } from "../_components/Footer";

export const metadata: Metadata = {
  title: "Unwitty Dev",
  description: "Personal portfolio for Ankush Jamdagani aka Unwitty Dev",
};

const WORK_ANCHORS = [
  { id: "companies", label: "Companies" },
  { id: "writing", label: "Writing" },
  { id: "projects", label: "Projects" },
];

export default function WorkRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-work font-work-body">
      <Nav />
      <SectionRail anchors={WORK_ANCHORS} />
      {children}
      <Footer />
    </div>
  );
}
