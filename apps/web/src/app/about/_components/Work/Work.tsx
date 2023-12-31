import Image from "next/image";
import Link from "next/link";

import "./Work.styles.css";

const Jobs = [
  {
    company: "Rippling",
    link: {
      website: "https://rippling.com/",
      linkedin: "https://www.linkedin.com/company/rippling/about/",
    },
    logo: "/images/company-logo/rippling.jpeg",
    startDate: { value: "2022-12-05", displayValue: "Dec '22" },
    endDate: { value: "2023-09-05", displayValue: "Sep '23" },
    description: "",
    title: "Senior Frontend Engineer",
    techStack: ["react.js", "javascript", "typescript", "storybook"],
  },
  {
    company: "Lambdatest",
    link: {
      website: "https://www.lambdatest.com/",
      linkedin: "https://www.linkedin.com/company/lambdatest/about/",
    },
    logo: "/images/company-logo/lambdatest.jpeg",
    startDate: { value: "2021-12-01", displayValue: "Dec '21" },
    endDate: { value: "2022-11-30", displayValue: "Nov '22" },
    description: "",
    title: "Senior Frontend Engineer",
    techStack: ["react.js", "javascript", "typescript", "storybook"],
  },
  {
    company: "Synaptic",
    link: {
      website: "https://synaptic.com/",
      linkedin: "https://www.linkedin.com/company/synaptic-data/about/",
    },
    logo: "/images/company-logo/synaptic_data.jpeg",
    startDate: { value: "2019-07-04", displayValue: "Jul '19" },
    endDate: { value: "2021-11-30", displayValue: "Nov '21" },
    description: "",
    title: "Senior Frontend Engineer",
    techStack: ["react.js", "javascript", "typescript", "storybook"],
  },
  {
    company: "Caroobi",
    link: {
      website: "https://www.caroobi.com/",
      linkedin: "https://www.linkedin.com/company/caroobi/about/",
    },
    logo: "/images/company-logo/caroobi.jpeg",
    startDate: { value: "2017-12-01", displayValue: "Dec '17" },
    endDate: { value: "2019-06-30", displayValue: "Jun '19" },
    description: "",
    title: "Software Engineer - Frontend",
    techStack: ["react.js", "javascript", "typescript", "storybook"],
  },
  {
    company: "Adurcup",
    link: {
      website: "",
      linkedin:
        "https://www.linkedin.com/company/adcount-technologies-pvt-ltd/about/",
    },
    logo: "/images/company-logo/adurcup.jpeg",
    startDate: { value: "2016-09-08", displayValue: "Sep '16" },
    endDate: { value: "2017-11-30", displayValue: "Nov '17" },
    description: "",
    title: "Software Engineer - Frontend",
    techStack: ["react.js", "javascript", "typescript", "storybook"],
  },
];

export function Work() {
  return (
    <section id="container-work" className="container">
      <h2>Experience</h2>
      <ul>
        {Jobs.map((job) => (
          <li key={job.company}>
            <Link
              href={job.link.linkedin}
              aria-label={job.company}
              className="job shadow-box"
              target="_blank"
            >
              <Image src={job.logo} alt={job.company} width={40} height={40} />
              <header>
                <p>{job.title}</p>
                <h3>{job.company}</h3>
              </header>
              <div>
                <time dateTime={job.startDate.value}>
                  {job.startDate.displayValue}
                </time>{" "}
                -{" "}
                <time dateTime={job.endDate.value}>
                  {job.endDate.displayValue}
                </time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
