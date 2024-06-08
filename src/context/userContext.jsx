import React, { useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { axiosInstance } from "../utils/axios";

// Creating Context
const UserContext = React.createContext();

// Hook to consume the context
export function useDBUser() {
  return useContext(UserContext);
}

// UserProvider Component that provides the dbUser context to all its children
export function UserProvider({ children }) {
  const [dbUser, setDbUser] = useState(null);
  const { currentUser } = useAuth();

  const fetchUser = () => {
    if (currentUser) {
      axiosInstance
        .post("/auth/get-user", { user: currentUser })
        .then((res) => {
          setDbUser(res?.data?.user);
        })
        .catch((err) => {
          setDbUser(null);
          console.log(err);
        });
    } else {
      setDbUser(null);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchUser();
    }, 1000);
  }, [currentUser?.email]);

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
