// Primary button - colored background and white text
const CTAButton = ({ text, onClick, disabled, disabledText }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="bg-gradient-to-br from-cta to-hovercta text-white min-w-14 py-2 px-5 shadow rounded-xl w-full hover:bg-hovercta hover:scale-105 hover:border-hovercta transition-all "
    >
      {disabled ? disabledText : text}
    </button>
  );
};

export default CTAButton;
