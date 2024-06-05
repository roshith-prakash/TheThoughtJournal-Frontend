import React from "react";

// Component to display errors
const ErrorStatement = ({ text }) => {
  return <p className="mt-1 text-sm text-error">{text}</p>;
};

export default ErrorStatement;
