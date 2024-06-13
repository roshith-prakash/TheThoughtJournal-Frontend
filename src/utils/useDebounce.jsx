import { useEffect, useState } from "react";

// Hook to debounce user input
const useDebounce = (value, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Runs each time value is changed - clearing timeout if user is still typing & changing value only when user stops typing & one second has passed.
  useEffect(() => {
    // Set timeout to change debounce value
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout to cancel changing the value
    return () => clearTimeout(timeout);
  }, [value]);

  // Return the debounced value
  return debouncedValue;
};

export default useDebounce;
