import { useState } from "react";

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (content: string) => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return { copied, copy };
}

export default useCopy;
