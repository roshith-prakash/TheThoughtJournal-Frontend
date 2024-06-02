import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, placeholder, onChange }) => {
  const [display, setDisplay] = useState(false);
  return (
    <div className="relative w-full">
      <input
        type={display ? "text" : "password"}
        className="border-b-2 placeholder:text-greyText w-full py-2 min-h-8 mt-3 focus:outline-none"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
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
