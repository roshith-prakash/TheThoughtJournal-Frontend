const CTAButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="border-cta min-w-14 bg-cta border-2 py-2 px-5 rounded-xl w-full hover:bg-hovercta hover:border-hovercta transition-all "
    >
      {text}
    </button>
  );
};

export default CTAButton;
