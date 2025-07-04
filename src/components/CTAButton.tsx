import { MouseEventHandler } from "react";
import { cn } from "@/lib/utils";

// Primary button - colored background and white text
const CTAButton = ({
  text,
  onClick,
  disabled,
  disabledText,
  className,
}: {
  text: string | React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  disabledText?: string;
  className?: string;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        `bg-gradient-to-br from-cta to-hovercta text-white min-w-14 py-2 px-5 shadow rounded-xl w-full hover:bg-hovercta hover:scale-105 hover:border-hovercta transition-all ${className}`
      )}
    >
      {disabled ? disabledText : text}
    </button>
  );
};

export default CTAButton;
