import Link from "next/link";

import { profile } from "@/config/profile";

const LINKS = [
  { href: "/#projects", label: "Projects" },
  { href: "/#activity", label: "Activity" },
  { href: "/#about", label: "About" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-nav border-b border-line/[0.06] bg-canvas/80 backdrop-blur-md backdrop-saturate-[1.8]">
      <nav aria-label="Site" className="container-content flex h-14 items-center gap-6">
        <Link href="/" aria-label={`${profile.site} home`} className="inline-flex items-center gap-2 font-semibold tracking-[-0.01em]">
          <span aria-hidden className="grid grid-cols-[5px_5px] gap-[2px]">
            <span className="size-[5px] rounded-[1px] bg-fg" />
            <span className="size-[5px] rounded-[1px] bg-fg" />
            <span className="size-[5px] rounded-[1px] bg-fg" />
            <span className="size-[5px] rounded-[1px] bg-well" />
          </span>
          unwitty
        </Link>
        <div className="hidden gap-1 text-fg-muted sm:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-2.5 py-2 transition-colors hover:text-fg">
              {link.label}
            </Link>
          ))}
        </div>
        <span className="flex-1" />
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary h-8 rounded-lg px-3 text-[13px]"
        >
          Résumé
        </a>
      </nav>
    </header>
  );
}
