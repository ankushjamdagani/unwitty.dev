type UnwittyLogoProps = {
  className?: string;
};

export function UnwittyLogo({ className = "" }: UnwittyLogoProps) {
  return (
    <span
      className={`inline-flex items-center font-mono text-md font-bold ${className}`}
    >
      <span className="rounded-md bg-fg px-2 py-1.5 font-bold text-canvas">
        Unwitty
      </span>
      <span className="ml-0.5 text-fg-muted">.dev</span>
    </span>
  );
}
