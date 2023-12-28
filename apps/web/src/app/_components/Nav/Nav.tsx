"use client";

import { useState } from "react";
import Link from "next/link";

import { ThemeToggle } from "./ThemeToggle";

import "./Nav.styles.css";

const Links = [
  // {
  //   path: "#info",
  //   label: "Info",
  // },
  {
    path: "#projects",
    label: "Experiments",
  },
  {
    path: "#words",
    label: "Thoughts",
  },
  {
    path: "#work",
    label: "Work",
  },
];

export function Nav() {
  const [activeLink, setActiveLink] = useState(window.location.hash);

  return (
    <aside id="navigation-bar">
      <nav>
        <ul>
          {Links.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                prefetch={false}
                onClick={() => setActiveLink(link.path)}
                className={activeLink === link.path ? "active" : ""}
                aria-current={activeLink === link.path}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </aside>
  );
}
