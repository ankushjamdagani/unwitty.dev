import Link from "next/link";

type BreadCrumb = {
  options: { path?: string; label: string }[];
};

export function BreadCrumb({ options }: BreadCrumb) {
  return (
    <ul className="flex gap-6 py-2">
      {options.map((option) => (
        <li
          key={option.path || option.label}
          className="relative text-xs after:absolute after:bottom-1 after:left-[calc(100%+6px)] after:h-[6px] after:w-[6px] after:rotate-45 after:border-r-[1px] after:border-t-[1px] after:border-solid after:border-foreground after:content-[''] last:after:hidden"
        >
          {option.path ? (
            <Link href={option.path} className="font-medium">
              {option.label}
            </Link>
          ) : (
            option.label
          )}
        </li>
      ))}
    </ul>
  );
}
