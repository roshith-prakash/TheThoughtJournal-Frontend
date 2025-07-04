import { InputHTMLAttributes, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Styled Text input
const PasswordInput = ({
  value,
  placeholder,
  onChange,
  className = "",
  disabled,
  ...rest
}: InputProps) => {
  // State to convert field to text or password field
  const [display, setDisplay] = useState(false);
  return (
    // Relative div
    <div className="relative w-full">
      {/* Input field - can be text or password field depending on state */}
      <input
        type={display ? "text" : "password"}
        className={cn(
          `border-b-2 bg-transparent placeholder:text-greyText w-full py-2 min-h-8 mt-3 focus:outline-none ${className}`
        )}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      {/* Absolutely positioned icon - acts as buttons to change field type */}
      {display ? (
        <FaEye
          className="absolute top-6 right-2 cursor-pointer"
          onClick={() => setDisplay((prev) => !prev)}
        />
      ) : (
        <FaEyeSlash
          className="absolute top-6 right-2 cursor-pointer"
          onClick={() => setDisplay((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default PasswordInput;
