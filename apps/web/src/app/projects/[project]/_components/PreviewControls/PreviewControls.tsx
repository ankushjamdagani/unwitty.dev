import { GoArrowUpRight } from "react-icons/go";
import { MdFullscreen } from "react-icons/md";

import "./PreviewControls.styles.css";

export function PreviewControls() {
  return (
    <div className="preview-controls">
      <button>
        Github <GoArrowUpRight />
      </button>
      |
      <button>
        Fullscreen <MdFullscreen />
      </button>
    </div>
  );
}
