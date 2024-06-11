// Styled Text input
const Input = ({ value, placeholder, onChange }) => {
  return (
    <input
      type="text"
      className="border-b-2 placeholder:text-greyText w-full py-2 min-h-8 mt-3 focus:outline-none"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
