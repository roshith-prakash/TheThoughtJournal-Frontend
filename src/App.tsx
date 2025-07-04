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
  ForgotPassword,
  AuthAction,
} from "./pages";
import { useEffect } from "react";
import { Footer, Navbar, Protector } from "./components";
import SecurityHeaders from "./components/SecurityHeaders";
import Aos from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";

// Creating Tanstack query client
const queryClient = new QueryClient();

function App() {
  // AOS Setting
  useEffect(() => {
    Aos.init({
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);

  return (
    <>
      {/* Providing client to children */}
      <QueryClientProvider client={queryClient}>
        {/* Providing auth context to children */}
        <AuthProvider>
          {/* Providing Db user data to children */}
          <UserProvider>
            <>
              <Toaster />
              <SecurityHeaders />
              <BrowserRouter>
                <Navbar />
                <main className="min-h-screen font-body  dark:bg-black/90 dark:text-darkmodetext">
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

                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/auth-action" element={<AuthAction />} />

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
                  <div className="pt-28">
                    <Footer />
                  </div>
                </main>
              </BrowserRouter>
            </>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
