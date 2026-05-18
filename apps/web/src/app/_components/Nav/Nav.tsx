"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoArrowUpRight } from "react-icons/go";

import { ThemeToggle } from "./ThemeToggle";

import useMostVisibleItem from "@/hooks/useMostVisibleItem";

export enum NavVariant {
  WELCOME = "welcome",
  WORK = "work",
  LIFE = "life",
}

const Links = {
  [NavVariant.WORK]: [
    {
      path: "/#projects",
      label: "Experiments",
    },
    {
      path: "/#words",
      label: "Thoughts",
    },
    {
      path: "/#work",
      label: "Work",
    },
    {
      path: "#resume",
      label: "Resume",
      icon: () => <GoArrowUpRight />,
    },
  ],
  [NavVariant.LIFE]: [],
  [NavVariant.WELCOME]: [],
};

export function Nav({ variant }: { variant: NavVariant }) {
  const path = usePathname();
  const activeElement = useMostVisibleItem("main > section[id]");
  const activePath = `/#${activeElement?.id}`;

  const links = Links[variant];

  return (
    <header
      id="navigation-bar"
      className="border-ink-2 z-nav h-nav sticky top-0 flex items-center justify-between border-b-[length:var(--border-width)] border-dashed px-[var(--horizontal-gap)]"
    >
      <span>
        <Link
          href="/"
          id="logo"
          className="bg-foreground rounded px-2 py-1 font-bold text-background"
        >
          Unwitty
        </Link>
        {"  "}.dev
      </span>
      <nav>
        <ul className="flex items-center text-[0.875em]">
          {links.map((link) => (
            <React.Fragment key={link.path}>
              <li className="px-2">
                <Link
                  href={link.path}
                  prefetch={true}
                  className={`inline-flex rounded p-2 hover:font-bold ${
                    activePath === link.path ? "font-bold" : ""
                  }`}
                  aria-current={path === link.path}
                >
                  <>
                    {link.label}
                    {link.icon ? (
                      <span className="ml-1 mt-[2px]">{link.icon()}</span>
                    ) : null}
                  </>
                </Link>
              </li>

              <div className="seperator-rect-sm last-of-type:hidden"></div>
            </React.Fragment>
          ))}
          <li className="px-2">
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
