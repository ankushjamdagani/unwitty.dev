"use client";

import Link from "next/link";

import "./Nav.styles.css";
import { useState } from "react";

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
      </ul>
    </nav>
  );
}
