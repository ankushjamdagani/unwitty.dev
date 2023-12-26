import Link from "next/link";
import React from "react";

export function Nav() {
  return (
    <nav>
      <Link href={"#info"}>Info</Link>
      <Link href={"#projects"}>Projects</Link>
      <Link href={"#blogs"}>Blogs</Link>
      <Link href={"#work"}>Work</Link>
    </nav>
  );
}
