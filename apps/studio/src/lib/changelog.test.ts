import { describe, expect, it } from "vitest";

import { parseChangelog, toBuildLog } from "./changelog";

const SAMPLE = `# Changelog

Intro text with a [link](https://example.com).

## [Unreleased]

### Added
- README rewrite, \`CONTRIBUTING.md\`, issue and pull request templates.
- MIT \`LICENSE\` and CODE_OF_CONDUCT.md, _emphasis_.

## [0.1.0] - 2026-10-08

### Added
- Initial public preview: unified canvas,
  seeded simulation.

### Changed
- App header version now derives from \`package.json\` (was **hardcoded**).

## [0.0.1] - 2026-01-01
`;

describe("parseChangelog", () => {
  it("reads releases, dates and sections", () => {
    const releases = parseChangelog(SAMPLE);
    expect(releases.map((r) => [r.version, r.date])).toEqual([
      ["Unreleased", null],
      ["0.1.0", "2026-10-08"],
    ]);
    expect(releases[1]?.sections.map((s) => s.kind)).toEqual(["Added", "Changed"]);
  });

  it("joins wrapped bullets and strips inline markdown", () => {
    const [, release] = parseChangelog(SAMPLE);
    expect(release?.sections[0]?.items).toEqual([
      "Initial public preview: unified canvas, seeded simulation.",
    ]);
    expect(release?.sections[1]?.items[0]).toBe(
      "App header version now derives from package.json (was hardcoded).",
    );
  });

  it("keeps underscores inside words", () => {
    const [unreleased] = parseChangelog(SAMPLE);
    expect(unreleased?.sections[0]?.items[1]).toBe("MIT LICENSE and CODE_OF_CONDUCT.md, emphasis.");
  });

  it("flattens to one entry per bullet, newest first", () => {
    const log = toBuildLog(parseChangelog(SAMPLE));
    expect(log).toHaveLength(4);
    expect(log[0]).toMatchObject({ version: "Unreleased", kind: "Added" });
    expect(log[3]).toMatchObject({ version: "0.1.0", kind: "Changed" });
  });

  it("returns nothing for text without releases", () => {
    expect(parseChangelog("# Changelog\n\n- loose bullet")).toEqual([]);
  });
});
