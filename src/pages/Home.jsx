import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useDBUser } from "../context/userContext";
import { useAuth } from "../context/authContext";
import { Footer, PostCard } from "../components";

const Home = () => {
  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Home | The Thought Journal";
  }, []);

  // // Get the DB user
  const { dbUser } = useDBUser();
  const { currentUser } = useAuth();

  console.log("Firebase user", currentUser);
  console.log("DB USER", dbUser);

  // Query to get posts
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      return axiosInstance.get("/post/get-recent-posts");
    },
  });

  console.log(data);

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="pb-32">
        <div className="p-5">
          <h1 className="text-4xl font-semibold px-2 py-5">
            Welcome{" "}
            <span className="bg-gradient-to-r from-cta to-hovercta bg-clip-text text-transparent">
              {dbUser?.name ? dbUser?.name : "User"}!
            </span>
          </h1>

          <h3 className="text-2xl font-semibold px-2">Let's start reading!</h3>
        </div>
        <div>
          {isLoading && <p>Loading</p>}
          {error && <p>Error</p>}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 ">
            {data &&
              data?.data?.posts?.map((post, index) => {
                return <PostCard post={post} index={index} />;
              })}
          </div>
        </div>
      </div>
      <div className="hidden pt-20 lg:block">
        <Footer />
      </div>
    </>
  );
};

export default Home;
