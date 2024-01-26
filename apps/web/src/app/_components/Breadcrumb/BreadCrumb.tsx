import Link from "next/link";
import "./BreadCrumb.styles.css";

type BreadCrumb = {
  options: { path?: string; label: string }[];
};

export function BreadCrumb({ options }: BreadCrumb) {
  return (
    <ul className="breadcrumb-wrapper">
      {options.map((option) => (
        <li key={option.path || option.label}>
          {option.path ? (
            <Link href={option.path}>{option.label}</Link>
          ) : (
            option.label
          )}
        </li>
      ))}
    </ul>
  );
}
