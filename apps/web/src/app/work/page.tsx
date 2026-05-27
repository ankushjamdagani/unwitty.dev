import { LedgerShell } from "./_components/LedgerShell";
import { LedgerHero } from "./_components/LedgerHero";
import { LedgerCompanies } from "./_components/LedgerCompanies";
import { LedgerWriting } from "./_components/LedgerWriting";
import { LedgerProjects } from "./_components/LedgerProjects";
import { MarqueeText } from "../_components/MarqueeText";
import Link from "next/link";

export default function WorkHome() {
  return (
    <div className="theme-work">
      <LedgerShell>
        <div className="w-full max-w-content mx-auto px-4 -mb-12">
          <LedgerHero />
        </div>

        <MarqueeText />

        <div className="w-full max-w-content mx-auto px-4 mt-24 relative">
          <LedgerCompanies />
          <LedgerWriting />
          <LedgerProjects />

          {/* Resume Section */}
          <section className="my-24 flex flex-col items-center relative">
            <div className="flex items-center gap-4 w-full mb-16 relative z-base justify-center">
              <div className="flex-grow h-px bg-ledger-outline opacity-30 [filter:url(#ledger-rough)]"></div>
              <span className="text-[11px] font-medium text-fg-muted uppercase tracking-[0.4em]">
                ***
              </span>
              <div className="flex-grow h-px bg-ledger-outline opacity-30 [filter:url(#ledger-rough)]"></div>
            </div>

            <Link
              href="/resume.pdf"
              target="_blank"
              className="group relative px-16 py-8"
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-ledger-outline group-hover:border-fg-contrast transition-colors z-base" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-ledger-outline group-hover:border-fg-contrast transition-colors z-base" />

              <span className="relative z-base text-4xl md:text-6xl font-medium text-fg-contrast font-work-heading tracking-tighter text-center transition-colors duration-300">
                résumé
              </span>
            </Link>
          </section>
        </div>
      </LedgerShell>
    </div>
  );
}
