import { IconType } from "react-icons";
import { Toggle } from "@base-ui-components/react/toggle";

export enum Size {
  sm,
  md,
  lg,
}

type ActionButtonProps = {
  icon: IconType;
  iconSize?: Size;
} & Toggle.Props;

const SizeClasses = {
  [Size.sm]: "h-2 w-2",
  [Size.md]: "h-4 w-4",
  [Size.lg]: "h-6 w-6",
};

export default function ActionButton({
  icon,
  iconSize = Size.md,
  ...props
}: ActionButtonProps) {
  const IconComponent = icon;
  return (
    <Toggle
      {...props}
      render={(props, state) => (
        <button
          type="button"
          {...props}
          className={`cursor-pointer border border-gray-300 rounded-4xl bg-gray-200 h-10 aspect-square flex items-center justify-center transition-transform hover:scale-110 ${state.pressed ? "bg-gray-800 text-white" : ""} ${props.className || ""}`}
        >
          <IconComponent className={`${SizeClasses[iconSize]}`} />
        </button>
      )}
    />
  );
}
