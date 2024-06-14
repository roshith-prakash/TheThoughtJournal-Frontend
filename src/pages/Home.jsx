import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../utils/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDBUser } from "../context/userContext";
import { useAuth } from "../context/authContext";
import { Footer, PostCard } from "../components";
import MoonLoader from "react-spinners/MoonLoader";
import { useInView } from "react-intersection-observer";

const Home = () => {
  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { ref, inView } = useInView();

  // Set window title.
  useEffect(() => {
    document.title = "Home | The Thought Journal";
  }, []);

  // // Get the DB user
  const { dbUser } = useDBUser();
  const { currentUser } = useAuth();

  // Query to get posts
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["recent-posts-home"],
      queryFn: async ({ pageParam }) => {
        return axiosInstance.post("/post/get-recent-posts", {
          page: pageParam,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        console.log(lastPage);
        return lastPage?.data?.nextPage;
      },
    });

  useEffect(() => {
    if (inView) {
      console.log("fetching");
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  console.log(data);
  console.log(inView);
  console.log(isFetchingNextPage);

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
          {isLoading && (
            <div className="h-96 flex justify-center items-center">
              <MoonLoader
                color={"#9b0ced"}
                loading={isLoading}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
          {error && <p>Error</p>}

          {data && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 ">
              {data &&
                data?.pages?.map((page) => {
                  return page?.data?.posts?.map((post, index) => {
                    return <PostCard post={post} index={index} />;
                  });
                })}
            </div>
          )}
          <div ref={ref}></div>
        </div>
      </div>
      <div className="pt-20">
        <Footer />
      </div>
    </>
  );
};

export default Home;
