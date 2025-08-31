import { IconType } from "react-icons";

export enum Size {
  sm,
  md,
  lg,
}

type ActionButtonProps = {
  className?: string;
  icon: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: Size;
};

const SizeClasses = {
  [Size.sm]: "h-2 w-2",
  [Size.md]: "h-4 w-4",
  [Size.lg]: "h-6 w-6",
};

export default function ActionButton({
  className,
  icon,
  onClick,
  size = Size.md,
}: ActionButtonProps) {
  const IconComponent = icon;
  return (
    <button
      className={`cursor-pointer border border-gray-300 rounded-4xl bg-gray-200 h-10 aspect-square flex items-center justify-center transition-transform hover:scale-110 ${className || ""}`}
      onClick={onClick}
    >
      <IconComponent className={`${SizeClasses[size]}`} />
    </button>
  );
}
