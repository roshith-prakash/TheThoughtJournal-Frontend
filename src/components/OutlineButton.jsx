const OutlineButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="min-w-14 font-medium shadow-md py-2 px-5 rounded-lg w-full text-cta hover:bg-cta active:shadow transition-all "
    >
      {text}
    </button>
  );
};

export default OutlineButton;
