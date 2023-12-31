"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

import { ThemeToggle } from "./ThemeToggle";

import "./Nav.styles.css";

const Links = [
  // {
  //   path: "#hero",
  //   label: "Hero",
  // },
  // {
  //   path: "/#projects",
  //   label: "Experiments",
  // },
  // {
  //   path: "/#words",
  //   label: "Thoughts",
  // },
  {
    path: "/about",
    label: "About",
  },
  {
    path: "#resume",
    label: "Resume",
    icon: () => <GoArrowUpRight />,
  },
];

export function Nav() {
  const [activeLink, setActiveLink] = useState(window.location.hash);

  return (
    <header id="navigation-bar">
      <Link href="/" id="logo">
        Unwitty.dev
      </Link>
      <nav>
        <ul>
          {Links.map((link) => (
            <React.Fragment key={link.path}>
              <li>
                <Link
                  href={link.path}
                  prefetch={false}
                  onClick={() => setActiveLink(link.path)}
                  className={activeLink === link.path ? "active" : ""}
                  aria-current={activeLink === link.path}
                >
                  <>
                    {link.label}
                    {link.icon ? link.icon() : null}
                  </>
                </Link>
              </li>

              <div className="seperator-rect-sm"></div>
            </React.Fragment>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
