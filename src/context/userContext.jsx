import { useContext, useState, useEffect, createContext } from "react";
import { useAuth } from "./authContext";
import { axiosInstance } from "../utils/axios";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

// Creating Context
const UserContext = createContext();

// Hook to consume the context
// eslint-disable-next-line react-refresh/only-export-components
export function useDBUser() {
  return useContext(UserContext);
}

// UserProvider Component that provides the dbUser context to all its children
export function UserProvider({ children }) {
  const [dbUser, setDbUser] = useState(null);
  const { currentUser } = useAuth();

  // Fetch current user information from database - UseQuery Method
  const { data, refetch: fetchUser } = useQuery({
    queryKey: ["dbUser", currentUser],
    queryFn: async () => {
      return axiosInstance.post("/auth/get-current-user", {
        user: currentUser,
      });
    },
    refetchInterval: 60000,
    enabled: !!currentUser,
  });

  // Set the state value
  useEffect(() => {
    if (data?.data?.user) {
      setDbUser(data?.data?.user);
    } else {
      setDbUser(null);
    }
  }, [currentUser?.email, data]);

  // Value object to be passed in context
  const value = {
    dbUser,
    setDbUser,
    fetchUser,
  };

  return (
    // Context Provider
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.element,
};
