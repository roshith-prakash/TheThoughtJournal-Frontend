const OutlineButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="border-cta min-w-14 border-2 py-2 px-5 rounded-full text-cta hover:bg-cta hover:text-white transition-all "
    >
      {text}
    </button>
  );
};

export default OutlineButton;
