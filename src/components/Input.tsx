import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Styled Text input
const Input = ({
  value,
  placeholder,
  onChange,
  className = "",
  disabled,
  ...rest
}: InputProps) => {
  return (
    <input
      type="text"
      className={`border-b-2 dark:border-white/25 bg-transparent placeholder:text-greyText w-full py-2 min-h-8 mt-3 focus:outline-none ${className}`}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
