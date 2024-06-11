import { AuthProvider } from "./context/authContext";
import { UserProvider } from "./context/userContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  NotFound,
  Signup,
  Login,
  Signout,
  CreatePost,
  Post,
  User,
  Onboarding,
  Profile,
} from "./pages";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { Protector } from "./components";

// Creating Tanstack query client
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const socket = io("http://localhost:4000");

    // Maintain connection to render server so it doesn't die.
    const interval = setInterval(() => {
      socket.emit("toMaintainConnection");
    }, 5000);

    // Clear the loop
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Providing client to children */}
      <QueryClientProvider client={queryClient}>
        {/* Providing auth context to children */}
        <AuthProvider>
          {/* Providing Db user data to children */}
          <UserProvider>
            <BrowserRouter>
              <Routes>
                {/* Home Page */}
                <Route path="/" element={<Home />} />

                {/* Signup route */}
                <Route path="/signup" element={<Signup />} />

                {/* Login route */}
                <Route path="/login" element={<Login />} />

                {/* Route to onboard a new user */}
                <Route path="/onboarding" element={<Onboarding />} />

                {/* Log out route */}
                <Route path="/signout" element={<Signout />} />

                {/* Route to create a new post. */}
                <Route
                  path="/addPost"
                  element={
                    <Protector>
                      <CreatePost />
                    </Protector>
                  }
                />

                {/* Logged in User's Profile */}
                <Route path="/profile" element={<Profile />} />

                {/* View a Post */}
                <Route path="/post/:postId" element={<Post />} />

                {/* View a User's Profile (Non Logged in user) */}
                <Route path="/user/:username" element={<User />} />

                {/* 404 error page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
