import { profile, socialLinks } from "@/config/profile";

export function Footer() {
  return (
    <footer className="container-content mt-section flex flex-wrap justify-between gap-3 border-t border-line/[0.06] pb-10 pt-6 text-[13px] text-fg-subtle">
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <span className="flex gap-4">
        {socialLinks.map((link) => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
            {link.label}
          </a>
        ))}
      </span>
    </footer>
  );
}
