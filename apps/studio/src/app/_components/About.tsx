import Image from "next/image";

import { companies } from "@/config/companies";
import { profile } from "@/config/profile";
import type { Company } from "@/config/types";

import { ContactCard } from "./ContactCard";
import { DotField } from "./DotField";
import { LocalTime } from "./LocalTime";

const chip = "rounded-full bg-surface px-2.5 py-1 font-mono text-[11px] text-fg-body shadow-hairline";
const label = "font-mono text-[10px] uppercase tracking-[0.06em] text-fg-subtle";

function CompanyLogo({ company }: { company: Company }) {
  const tile = company.logo ? (
    <Image
      src={company.logo}
      alt=""
      width={22}
      height={22}
      className="size-[22px] rounded-md object-cover shadow-hairline contrast-125 grayscale"
    />
  ) : (
    <span className="block size-[22px] rounded-md bg-well" />
  );
  const tip = (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-fg px-1.5 py-0.5 font-mono text-[10px] text-white opacity-0 transition-opacity duration-[120ms] group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {company.name}
    </span>
  );
  const className = "group relative block rounded-md";

  return company.url ? (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name} (opens in a new tab)`}
      className={className}
    >
      {tile}
      {tip}
    </a>
  ) : (
    <span tabIndex={0} role="img" aria-label={company.name} className={className}>
      {tile}
      {tip}
    </span>
  );
}

export function About() {
  const { greeting, facts } = profile;

  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate pt-section">
      <DotField fade="center" />

      <div className="flex items-end justify-between gap-5">
        <div>
          <p className={`m-0 ${label}`}>About</p>
          <h2
            id="about-title"
            className="m-0 mt-2 text-[clamp(30px,4vw,38px)] font-medium leading-none tracking-[-0.045em]"
          >
            {greeting.lead} <em className="emphasis">{greeting.name}</em>
          </h2>
        </div>
        <Image
          src={profile.portrait}
          alt={`Portrait of ${profile.name}`}
          width={72}
          height={72}
          className="size-[72px] shrink-0 rounded-full object-cover shadow-hairline contrast-105 grayscale"
        />
      </div>

      <p className="m-0 mt-4 max-w-[560px] text-[15px] leading-[1.65] text-fg-body">{profile.about}</p>

      <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
        <li className={chip}>{facts.experience}</li>
        <li className={chip}>{facts.location}</li>
        <li className={chip}>
          <LocalTime timeZone={facts.timeZone} label={facts.timeZoneLabel} />
        </li>
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-x-3.5 gap-y-3 border-t border-line/[0.07] pt-4">
        <span className={label}>Worked with</span>
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {companies.map((company) => (
            <li key={company.name}>
              <CompanyLogo company={company} />
            </li>
          ))}
        </ul>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-[13px] underline decoration-line/25 underline-offset-4 hover:decoration-fg sm:ml-auto sm:w-auto"
        >
          Résumé <span aria-hidden>↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      <ContactCard />
    </section>
  );
}
