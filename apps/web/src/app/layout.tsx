import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={`${inter.className} mono`}>{children}</body>
    </html>
  );
}
