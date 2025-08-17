type InputContainerProps = {
  label: string;
  input: any;
  isVertical?: boolean;
};

function InputContainer({ label, input, isVertical }: InputContainerProps) {
  return (
    <label className={`${!isVertical && "grid-2"}`}>
      <div className="small">{label}</div>
      {input}
    </label>
  );
}

export default InputContainer;
