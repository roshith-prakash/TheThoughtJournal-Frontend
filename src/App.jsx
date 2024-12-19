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
  EditProfile,
  Search,
  EditPost,
} from "./pages";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Protector } from "./components";
import { prodURL } from "./utils/axios";
import SecurityHeaders from "./components/SecurityHeaders";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

// Creating Tanstack query client
const queryClient = new QueryClient();

function App() {
  // Maintain connection to render server so it doesn't die.
  useEffect(() => {
    const socket = io(prodURL);

    const interval = setInterval(() => {
      socket.emit("toMaintainConnection");
    }, 5000);

    socket.on("maintainReply", () => {});

    // Clear the loop
    return () => clearInterval(interval);
  }, []);

  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Providing client to children */}
      <QueryClientProvider client={queryClient}>
        {/* Providing auth context to children */}
        <AuthProvider>
          {/* Providing Db user data to children */}
          <UserProvider>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="dark:text-darkmodetext">
                    Please Note
                  </DialogTitle>
                  <DialogDescription className="pt-5 text-md text-black">
                    Initial request may take upto a minute due to server
                    limitations. Please be patient.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <SecurityHeaders />
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

                {/* Route to edit a post. */}
                <Route
                  path="/editPost"
                  element={
                    <Protector>
                      <EditPost />
                    </Protector>
                  }
                />

                {/* Logged in User's Profile */}
                <Route
                  path="/profile"
                  element={
                    <Protector>
                      <Profile />
                    </Protector>
                  }
                />

                {/* Edit Current User's Profile */}
                <Route
                  path="/editProfile"
                  element={
                    <Protector>
                      <EditProfile />
                    </Protector>
                  }
                />

                {/* View a Post */}
                <Route path="/post/:postId" element={<Post />} />

                {/* View a User's Profile (Non Logged in user) */}
                <Route path="/user/:username" element={<User />} />

                {/* Search a user or post */}
                <Route path="/search" element={<Search />} />

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
