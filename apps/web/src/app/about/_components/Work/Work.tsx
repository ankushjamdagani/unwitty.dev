import Image from "next/image";
import Link from "next/link";

import "./Work.styles.css";
import { GoArrowUpRight } from "react-icons/go";

/**
 * @todo:
 * - do I need tech stack?
 * - do I need work description?
 */

const Jobs = [
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
    <section id="work" className="container">
      <h2>Work History</h2>
      <ul className="content-list">
        {Jobs.map((job) => (
          <li key={job.company} className="content-item">
            <div className="start-time">
              <time className="year">
                {new Date(job.startDate).getFullYear()}
              </time>
              <time className="month">
                {new Date(job.startDate).toLocaleString("default", {
                  month: "long",
                })}
              </time>
            </div>

            <header>
              <Image
                src={job.logo}
                alt={job.company}
                width={40}
                height={40}
                className="company-logo"
              />
              <div>
                <h3>
                  <Link
                    href={job.link.linkedin}
                    aria-label={job.company}
                    target="_blank"
                  >
                    {job.company}
                    <GoArrowUpRight />
                  </Link>
                </h3>

                <p>{job.title}</p>
              </div>
            </header>

            <ul className="tech-list">
              {job.techStack.map((item) => (
                <li key={item} className="tech-item">
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
