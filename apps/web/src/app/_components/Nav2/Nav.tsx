"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoArrowUpRight } from "react-icons/go";

import { ThemeToggle } from "./ThemeToggle";

import useMostVisibileItem from "@/hooks/useMostVisibleItem";

enum PageType {
  WELCOME = "welcome",
  WORK = "work",
  LIFE = "life",
}

const Links = {
  [PageType.WORK]: [
    // {
    //   path: "#hero",
    //   label: "Hero",
    // },
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
    // {
    //   path: "/about",
    //   label: "About me",
    // },
    {
      path: "#resume",
      label: "Resume",
      icon: () => <GoArrowUpRight />,
    },
  ],
  [PageType.LIFE]: [],
  [PageType.WELCOME]: [],
};

export function Nav({ type = PageType.WELCOME }: { type?: PageType }) {
  const path = usePathname();
  const activeElement = useMostVisibileItem("main > section[id]");
  const activePath = `/#${activeElement?.id}`;

  return (
    <header
      id="navigation-bar"
      className="flex items-center justify-between border-ink-2 z-nav h-nav sticky top-0 border-b-2 border-dashed px-[var(--horizontal-gap)]"
    >
      <span>
        <Link
          href="/"
          id="logo"
          className="bg-ink rounded px-2 py-1 text-background"
        >
          Unwitty
        </Link>
        .dev
      </span>

      <nav>
        <ul className="flex items-center text-[0.875em]">
          {Links[type]?.map((link) => (
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
