import React from "react";

export const RoughUnderline = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        className="absolute -bottom-1 left-0 w-full h-2 pointer-events-none overflow-visible"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 5 Q 25 2, 50 5 T 100 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#ledger-rough)"
          className="opacity-60"
        />
      </svg>
    </span>
  );
};
