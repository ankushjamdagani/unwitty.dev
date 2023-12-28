import Link from "next/link";
import {
  FaGithub,
  FaLinkedinIn,
  FaRegEnvelope,
  FaXTwitter,
} from "react-icons/fa6";

import "./Footer.styles.css";

export function Footer() {
  return (
    <footer id="footer">
      <blockquote>
        “Art is the elimination of the unnecessary.” - Pablo Picasso
      </blockquote>
      <div className="content">
        <Link href="email:#">hello@unwitty.dev</Link>
        <ul>
          <li>
            <Link href="#">
              <FaGithub />
            </Link>
          </li>
          <li>
            <Link href="#">
              <FaXTwitter />
            </Link>
          </li>
          <li>
            <Link href="#">
              <FaLinkedinIn />
            </Link>
          </li>
          <li>
            <Link href="#">
              <FaRegEnvelope />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
