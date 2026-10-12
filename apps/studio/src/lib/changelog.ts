export type ChangelogRelease = {
  /** "0.1.0", or "Unreleased". */
  version: string;
  /** ISO date "YYYY-MM-DD", or null when unreleased/undated. */
  date: string | null;
  sections: { kind: string; items: string[] }[];
};

export type BuildLogEntry = {
  version: string;
  date: string | null;
  kind: string;
  text: string;
};

const RELEASE = /^##\s+\[?([^\]\s]+)\]?(?:\s*[-–—]\s*(\d{4}-\d{2}-\d{2}))?/;
const SECTION = /^###\s+(.+?)\s*$/;
const ITEM = /^\s*[-*]\s+(.*)$/;

/** Strips inline markdown (links, code, emphasis) to plain text. */
export function stripInline(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<!\w)__(.+?)__(?!\w)/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/(?<!\w)_(.+?)_(?!\w)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parses a Keep a Changelog file. Unknown lines are ignored. */
export function parseChangelog(markdown: string): ChangelogRelease[] {
  const releases: ChangelogRelease[] = [];
  let release: ChangelogRelease | undefined;
  let section: ChangelogRelease["sections"][number] | undefined;
  let item: string[] | undefined;

  const flush = () => {
    if (item && section) section.items.push(stripInline(item.join(" ")));
    item = undefined;
  };

  for (const line of markdown.split(/\r?\n/)) {
    const r = RELEASE.exec(line);
    if (r) {
      flush();
      release = { version: r[1] ?? "", date: r[2] ?? null, sections: [] };
      section = undefined;
      releases.push(release);
      continue;
    }
    if (!release) continue;

    const s = SECTION.exec(line);
    if (s) {
      flush();
      section = { kind: s[1] ?? "", items: [] };
      release.sections.push(section);
      continue;
    }
    if (!section) continue;

    const i = ITEM.exec(line);
    if (i && !line.startsWith("    ")) {
      flush();
      item = [i[1] ?? ""];
    } else if (item && line.trim()) {
      item.push(line.trim());
    } else {
      flush();
    }
  }
  flush();

  return releases.filter((r) => r.sections.some((s) => s.items.length));
}

/** Flattens releases into one entry per bullet, newest first. */
export function toBuildLog(releases: ChangelogRelease[]): BuildLogEntry[] {
  return releases.flatMap((r) =>
    r.sections.flatMap((s) =>
      s.items.map((text) => ({
        version: r.version,
        date: r.date,
        kind: s.kind,
        text,
      })),
    ),
  );
}
