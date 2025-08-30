import { IconType } from "react-icons";

export enum Size {
  sm,
  md,
  lg,
}

type ActionButtonProps = {
  extraStyles?: string;
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
  extraStyles,
  icon,
  onClick,
  size = Size.md,
}: ActionButtonProps) {
  const IconComponent = icon;
  return (
    <button className={`control-item ${extraStyles || ""}`} onClick={onClick}>
      <IconComponent className={`${SizeClasses[size]}`} />
    </button>
  );
}
