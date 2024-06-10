import React, { useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { axiosInstance } from "../utils/axios";
import { useQuery } from "@tanstack/react-query";

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

  // // Fetch current user information from database - Use Effect Method

  // const fetchUser = () => {
  //   if (currentUser) {
  //     axiosInstance
  //       .post("/auth/get-current-user", { user: currentUser })
  //       .then((res) => {
  //         setDbUser(res?.data?.user);
  //       })
  //       .catch((err) => {
  //         setDbUser(null);
  //         console.log(err);
  //       });
  //   } else {
  //     setDbUser(null);
  //   }
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     fetchUser();
  //   }, 1000);
  // }, [currentUser?.email]);

  // // Fetch current user information from database - UseQuery Method

  const {
    data,
    isLoading,
    error,
    refetch: fetchUser,
  } = useQuery({
    queryKey: ["dbUser", currentUser],
    queryFn: async () => {
      return axiosInstance.post("/auth/get-current-user", {
        user: currentUser,
      });
    },
    enabled: !!currentUser,
  });

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
