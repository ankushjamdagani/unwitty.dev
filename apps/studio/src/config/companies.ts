import type { Company } from "./types";

/** Newest first. Source: résumé, Dec 2025. */
export const companies: Company[] = [
  {
    name: "Atlassian",
    role: "Senior Software Engineer, Fullstack",
    location: "Bangalore",
    start: "2025-12",
    end: null,
    logo: "/images/company-logo/atlassian.svg",
    highlights: [
      "Built dynamic bin-packing for Remote Dev Environments on EC2, allocating users by live resource use.",
      "Led AI enablement for team repositories with LLM-based developer and support tooling.",
    ],
  },
  {
    name: "Uber",
    role: "Software Engineer 2, Fullstack",
    location: "Bangalore",
    start: "2024-04",
    end: "2025-12",
    logo: "/images/company-logo/uber.png",
    highlights: [
      "Tier-1 taxation services at 10k QPS; architected the tax-rules portal, cutting Tax-Ops queries by 80%.",
      "Built a Go shadow library for dependency migrations, saving 30 dev days in a quarter.",
    ],
  },
  {
    name: "Rippling",
    role: "Senior Frontend Engineer",
    location: "Bangalore",
    start: "2022-12",
    end: "2023-09",
    logo: "/images/company-logo/rippling.jpeg",
    highlights: [
      "Owned the core Grid library used across 34 teams; cut page load times by 20%.",
    ],
  },
  {
    name: "Lambdatest",
    role: "Senior Frontend Engineer",
    location: "Noida",
    start: "2021-12",
    end: "2022-11",
    logo: "/images/company-logo/lambdatest.jpeg",
    highlights: [
      "Led a product line for Microsoft and the move to micro-frontends.",
    ],
  },
  {
    name: "Synaptic",
    role: "Senior Frontend Engineer",
    location: "Gurugram",
    start: "2019-06",
    end: "2021-11",
    logo: "/images/company-logo/synaptic_data.jpeg",
    highlights: ["SDE 1 to SDE 3; 2× Star Performer."],
  },
  {
    name: "Caroobi",
    role: "Frontend Engineer",
    start: "2017",
    end: "2019",
    logo: "/images/company-logo/caroobi.jpeg",
    highlights: ["PageSpeed 64 → 94; Innovative Employee of the Year."],
  },
  {
    name: "Adurcup",
    role: "Frontend Engineer",
    start: "2016",
    end: "2017",
    logo: "/images/company-logo/adurcup.jpeg",
    highlights: ["E-commerce listing and booking flow with payments."],
  },
];
