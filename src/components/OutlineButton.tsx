import { MouseEventHandler } from "react";

// Styled button - button with shadow
const OutlineButton = ({
  text,
  onClick,
  disabled,
  disabledText = "Please Wait...",
}: {
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  disabledText?: string;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="min-w-14 dark:border-2 flex dark:text-darkmodetext justify-center font-medium shadow-md py-2 px-5 rounded-lg w-full text-ink active:shadow transition-all disabled:text-greyText hover:scale-105"
    >
      {disabled ? disabledText : text}
    </button>
  );
};

export default OutlineButton;
