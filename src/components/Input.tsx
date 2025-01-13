import { ChangeEventHandler } from "react";

// Styled Text input
const Input = ({
  value,
  placeholder,
  onChange,
  className = "",
}: {
  value: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className: string;
}) => {
  return (
    <input
      type="text"
      className={`border-b-2 bg-transparent placeholder:text-greyText w-full py-2 min-h-8 mt-3 focus:outline-none ${className}`}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
