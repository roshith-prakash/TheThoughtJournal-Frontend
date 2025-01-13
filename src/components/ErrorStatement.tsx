// Component to display errors
const ErrorStatement = ({ text }: { text: string }) => {
  return <p className="mt-1 text-sm text-error">{text}</p>;
};

export default ErrorStatement;
