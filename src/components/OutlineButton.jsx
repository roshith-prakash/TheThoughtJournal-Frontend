const OutlineButton = ({
  text,
  onClick,
  disabled,
  disabledText = "Please Wait...",
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="min-w-14 font-medium shadow-md py-2 px-5 rounded-lg w-full text-cta hover:bg-cta active:shadow transition-all disabled:text-greyText "
    >
      {disabled ? disabledText : text}
    </button>
  );
};

export default OutlineButton;
