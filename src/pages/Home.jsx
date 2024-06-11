import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useDBUser } from "../context/userContext";
import { useAuth } from "../context/authContext";
import { Footer } from "../components";

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

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="pb-32">
        <div className="p-5">
          <h1 className="text-4xl font-semibold px-2 py-5">
            Welcome {dbUser?.name ? dbUser?.name : "User"}!
          </h1>
        </div>
        <div>
          {isLoading && <p>Loading</p>}
          {error && <p>Error</p>}

          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {data &&
              data?.data?.posts?.map((post, index) => {
                return (
                  <Link key={index} to={`/post/${post?.id}`}>
                    <div className="my-5 mx-5 p-5 rounded-xl border-2 cursor-pointer hover:shadow-xl hover:scale-105 transition-all">
                      <img
                        src={post?.thumbnail}
                        className="h-40 w-full object-center object-contain mb-5"
                      />
                      <p>{post?.title}</p>
                      <p className="break-all">
                        <Link to={`/user/${post?.User?.username}`}>
                          {post?.User?.name
                            ? post?.User?.name
                            : "@" + String(post?.User?.username)}
                        </Link>
                      </p>
                      <p>
                        {post?.category != "OTHER"
                          ? post?.category
                          : post?.otherCategory}
                      </p>
                    </div>
                  </Link>
                );
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
