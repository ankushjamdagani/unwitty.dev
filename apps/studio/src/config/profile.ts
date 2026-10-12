import type { SocialLink } from "./types";

export const profile = {
  name: "Ankush Jamdagani",
  site: "unwitty.dev",
  headline: "I make tools for thinking.",
  title: "Senior Software Engineer · Fullstack",
  about:
    "Senior full-stack engineer with 9+ years building high-traffic products at Atlassian, Uber and Rippling — tax systems at 10k QPS, a data grid used by 34 teams, and AI tooling for developer workflows. On the side I build tools for thinking.",
  email: "hello@unwitty.dev",
  resumeUrl:
    "https://drive.google.com/file/d/1nXgwSoudFM3xklQOTARAojv_6IaZCM94/view?usp=sharing",
  github: "https://github.com/ankushjamdagani",
  /** Commits by this login count towards the activity graph. */
  githubLogin: "ankushjamdagani",
} as const;

export const socialLinks: SocialLink[] = [
  { label: "GitHub", url: "https://github.com/ankushjamdagani" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/ankushjamdagani/" },
  { label: "X", url: "https://x.com/unwitty_dev" },
];
