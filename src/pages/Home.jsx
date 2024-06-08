import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useDBUser } from "../context/userContext";

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
      <div className="p-5">Home</div>
      <div>
        {isLoading && <p>Loading</p>}
        {error && <p>Error</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {data &&
            data?.data?.posts?.map((post, index) => {
              return (
                <Link key={index} to={`/post/${post?.id}`}>
                  <div className="my-5 mx-5 p-5 rounded-xl border-2 cursor-pointer hover:shadow-xl transition-all">
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
    </>
  );
};

export default Home;
