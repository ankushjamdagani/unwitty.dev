import Link from "next/link";

import { profile } from "@/config/profile";

import { UnwittyLogo } from "./UnwittyLogo";

export function Footer() {
  return (
    <footer className="container-content mt-section flex flex-wrap items-center justify-between gap-3 border-t border-line/[0.06] pb-10 pt-6 text-[13px] text-fg-subtle">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <Link
        href="/"
        aria-label={`${profile.site} home`}
        className="inline-flex items-center"
      >
        <UnwittyLogo className="text-xs" />
      </Link>
    </footer>
  );
}
