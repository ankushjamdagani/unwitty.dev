type Props = {
  /** "top": fades out below the hero. "center": a soft field around the middle of the section. */
  fade: "top" | "center";
};

// Literal class names so Tailwind keeps them (dynamic names would be purged).
const FADE: Record<Props["fade"], string> = {
  top: "dot-field-top",
  center: "dot-field-center",
};

/** Decorative dot grid. The parent must be `relative isolate`. */
export function DotField({ fade }: Props) {
  return <div aria-hidden className={`dot-field ${FADE[fade]}`} />;
}
