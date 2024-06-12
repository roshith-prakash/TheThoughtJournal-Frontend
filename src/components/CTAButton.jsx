// Primary button - colored background and white text
const CTAButton = ({ text, onClick, disabled, disabledText }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="border-cta text-white min-w-14 bg-cta border-2 py-2 px-5 shadow rounded-xl w-full hover:bg-hovercta hover:border-hovercta transition-all "
    >
      {disabled ? disabledText : text}
    </button>
  );
};

export default CTAButton;
