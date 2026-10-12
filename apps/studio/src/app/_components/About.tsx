import Image from "next/image";

import { companies } from "@/config/companies";
import { profile } from "@/config/profile";
import { formatYearMonth } from "@/lib/format";

function period(start: string, end: string | null): string {
  const from = formatYearMonth(start);
  const to = formatYearMonth(end);
  return from === to ? from : `${from} — ${to}`;
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="flex flex-wrap gap-x-16 gap-y-6 pt-section">
      <h2 id="about-title" className="section-title flex-[1_1_200px]">
        About
      </h2>
      <div className="min-w-0 flex-[999_1_560px]">
        <p className="m-0 max-w-[620px] text-[15px] leading-[1.7] text-fg-body">{profile.about}</p>

        <ol className="mt-6 list-none border-t border-line/[0.06] p-0">
          {companies.map((company) => (
            <li key={company.name} className="flex items-center gap-3 border-b border-line/[0.06] py-2.5">
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt=""
                  width={20}
                  height={20}
                  className="size-5 shrink-0 rounded-[5px] object-cover shadow-hairline"
                />
              ) : (
                <span aria-hidden className="size-5 shrink-0 rounded-[5px] bg-well" />
              )}
              <span className="min-w-0 flex-1">
                <span className="font-medium">{company.name}</span>{" "}
                <span className="text-fg-subtle">· {company.role}</span>
              </span>
              <span className="shrink-0 font-mono text-[12px] text-fg-subtle">
                {period(company.start, company.end)}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-6 flex flex-wrap gap-2">
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            View résumé <span className="font-mono text-[11px] opacity-60">PDF</span>
          </a>
          <a href={`mailto:${profile.email}`} className="btn-secondary">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
}
