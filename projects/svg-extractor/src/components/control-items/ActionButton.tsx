import { Toggle } from "@base-ui-components/react/toggle";

export default function ActionButton({ children, ...props }: Toggle.Props) {
  return (
    <Toggle
      render={(props, state) => (
        <button
          type="button"
          {...props}
          className={`cursor-pointer border border-gray-300 rounded-4xl bg-gray-200 h-10 aspect-square flex items-center justify-center transition-transform hover:scale-110 ${state.pressed ? "bg-gray-800 text-white scale-110" : ""} ${props.className || ""}`}
        >
          {children}
        </button>
      )}
      {...props}
    />
  );
}
