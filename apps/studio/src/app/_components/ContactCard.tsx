import { profile, socialLinks } from "@/config/profile";

import { CopyEmail } from "./CopyEmail";

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

export function ContactCard() {
  const { contact } = profile;

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-x-7 gap-y-5 rounded-[18px] bg-surface p-[22px] shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.04)] sm:p-7">
      <div className="min-w-0">
        <h3 className="m-0 text-[22px] font-medium tracking-[-0.03em]">
          {contact.title} <em className="emphasis">{contact.emphasis}</em>
        </h3>
        <p className="m-0 mt-1 text-fg-muted">{contact.blurb}</p>
        <p className="m-0 mt-3 flex flex-wrap gap-4 text-[13px] text-fg-body">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.url} {...newTab} className="hover:text-fg">
              {link.label} <span aria-hidden>↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </p>
      </div>
      <div className="flex flex-col items-start gap-2.5 sm:items-end">
        <CopyEmail email={profile.email} />
        <a href={profile.resumeUrl} {...newTab} className="btn-primary">
          View résumé <span aria-hidden>↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
