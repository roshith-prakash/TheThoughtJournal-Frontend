import { useContext, useState, useEffect, createContext } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Creating Context
const AuthContext = createContext();

// Hook to consume the context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider Component that provides the auth context to all its children
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  // Function to set the state when user signs in or out
  async function initializeUser(user) {
    if (user) {
      // Set the currentuser and logged in status
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      // Set the currentuser and logged in status
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  // Value object to be passed in context
  const value = {
    userLoggedIn,
    currentUser,
    setCurrentUser,
  };

  return (
    // Context Provider
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
