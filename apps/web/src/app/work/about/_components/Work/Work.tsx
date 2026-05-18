import Image from "next/image";
import Link from "next/link";

import { GoArrowUpRight } from "react-icons/go";

/**
 * @todo:
 * - do I need tech stack?
 * - do I need work description?
 */

const Jobs = [
  {
    company: "Atlassian",
    link: {
      website: "https://www.atlassian.com/",
      linkedin: "https://www.linkedin.com/company/atlassian/about/",
    },
    logo: "/images/company-logo/atlassian.svg",
    startDate: "2026-01-01",
    endDate: "",
    description: "",
    title: "Senior Software Engineer - Fullstack",
    techStack: [
      "typescript",
      "react.js",
      "golang",
      "microservices",
      "postgreSQL",
      "AWS SQS",
      "Terraform",
      "AWS EC2",
      "ECS",
    ],
  },
  {
    company: "Uber",
    link: {
      website: "https://www.uber.com/",
      linkedin: "https://www.linkedin.com/company/uber-com/about/",
    },
    logo: "/images/company-logo/uber.png",
    startDate: "2024-04-01",
    endDate: "",
    description: "",
    title: "Software Engineer 2 - Fullstack",
    techStack: [
      "typescript",
      "react.js",
      "styled-components",
      "golang",
      "microservices",
      "mysql",
      "kafka",
      "redis",
    ],
  },
  {
    company: "Rippling",
    link: {
      website: "https://rippling.com/",
      linkedin: "https://www.linkedin.com/company/rippling/about/",
    },
    logo: "/images/company-logo/rippling.jpeg",
    startDate: "2022-12-05",
    endDate: "2023-09-05",
    description: "",
    title: "Senior Frontend Engineer",
    techStack: [
      "javascript",
      "typescript",
      "react.js",
      "styled-components",
      "storybook",
      "playwright",
      "jest",
      "retool",
      "snowflake",
    ],
  },
  {
    company: "Lambdatest",
    link: {
      website: "https://www.lambdatest.com/",
      linkedin: "https://www.linkedin.com/company/lambdatest/about/",
    },
    logo: "/images/company-logo/lambdatest.jpeg",
    startDate: "2021-12-01",
    endDate: "2022-11-30",
    description: "",
    title: "Senior Frontend Engineer",
    techStack: [
      "javascript",
      "typescript",
      "react.js",
      "next.js",
      "redux.js",
      "styled-components",
      "storybook",
      "jest",
    ],
  },
  {
    company: "Synaptic",
    link: {
      website: "https://synaptic.com/",
      linkedin: "https://www.linkedin.com/company/synaptic-data/about/",
    },
    logo: "/images/company-logo/synaptic_data.jpeg",
    startDate: "2019-07-04",
    endDate: "2021-11-30",
    description: "",
    title: "Senior Frontend Engineer",
    techStack: [
      "javascript",
      "react.js",
      "redux.js",
      "styled-components",
      "storybook",
    ],
  },
  {
    company: "Caroobi",
    link: {
      website: "https://www.caroobi.com/",
      linkedin: "https://www.linkedin.com/company/caroobi/about/",
    },
    logo: "/images/company-logo/caroobi.jpeg",
    startDate: "2017-12-01",
    endDate: "2019-06-30",
    description: "",
    title: "Software Engineer - Frontend",
    techStack: [
      "javascript",
      "react.js",
      "redux.js",
      "angular.js",
      "scss",
      "jquery",
    ],
  },
  {
    company: "Adurcup",
    link: {
      website: "",
      linkedin:
        "https://www.linkedin.com/company/adcount-technologies-pvt-ltd/about/",
    },
    logo: "/images/company-logo/adurcup.jpeg",
    startDate: "2016-09-08",
    endDate: "2017-11-30",
    description: "",
    title: "Software Engineer - Frontend",
    techStack: ["javascript", "jquery", "nunjucks", "node.js", "scss"],
  },
];

export function Work() {
  return (
    <section id="work" className="container items-start w-full">
      <h2>Work History</h2>
      <ul className="flex flex-col gap-16 p-8 pl-[var(--horizontal-gap)] pr-8 w-full">
        {Jobs.map((job) => (
          <li
            key={job.company}
            className="relative flex w-full max-w-[640px] flex-col flex-wrap gap-4"
          >
            <div className="border-foreground border-b-2 border-dashed pb-1">
              <time className="text-[2.75em]">
                {new Date(job.startDate).getFullYear()}
              </time>
              <time className="bg-background text-xs absolute left-0 top-[5.15em] pr-2 uppercase">
                {new Date(job.startDate).toLocaleString("default", {
                  month: "long",
                })}
              </time>
            </div>

            <header className="flex flex-1 items-center justify-start gap-4 mt-4">
              <Image
                src={job.logo}
                alt={job.company}
                width={40}
                height={40}
                className="rounded grayscale aspect-square"
              />
              <div>
                <h3 className="text-lg font-bold">
                  <Link
                    href={job.link.linkedin}
                    aria-label={job.company}
                    target="_blank"
                    className="inline-flex items-end gap-2"
                  >
                    {job.company}
                    <GoArrowUpRight />
                  </Link>
                </h3>

                <p>{job.title}</p>
              </div>
            </header>

            <ul className="flex flex-wrap gap-2">
              {job.techStack.map((item) => (
                <li
                  key={item}
                  className="text-xs rounded-[2px] border-thin border-solid border-foreground px-1 py-[2px]"
                >
                  {item}{" "}
                </li>
              ))}
            </ul>

            {job.description && <p>{job.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
