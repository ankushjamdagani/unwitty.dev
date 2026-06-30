import { LedgerShell } from "./_components/LedgerShell";
import { LedgerHero } from "./_components/LedgerHero";
import { LedgerCompanies } from "./_components/LedgerCompanies";
import { LedgerWriting } from "./_components/LedgerWriting";
import { LedgerProjects } from "./_components/LedgerProjects";
import { MarqueeText } from "../_components/MarqueeText";

export default function WorkHome() {
  return (
    <div className="theme-work">
      <LedgerShell>
        <div className="w-full max-w-content mx-auto px-4">
          <LedgerHero />
        </div>

        <MarqueeText />

        <div className="w-full max-w-content mx-auto px-4 mt-24 relative">
          <LedgerCompanies />
          <LedgerWriting />
          <LedgerProjects />
        </div>
      </LedgerShell>
    </div>
  );
}
