import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../utils/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDBUser } from "../context/userContext";
import { useAuth } from "../context/authContext";
import { Footer, PostCard } from "../components";
import HashLoader from "react-spinners/HashLoader";
import { useInView } from "react-intersection-observer";
import homeNoPosts from "../assets/homeNoPosts.svg";

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

  // Query to get posts by people followed
  const {
    data: posts,
    isLoading: loading,
    error: followingError,
    fetchNextPage: fetchFollowing,
    isFetchingNextPage: fetchingFollowedPosts,
  } = useInfiniteQuery({
    queryKey: ["following-posts-home", dbUser?.username],
    queryFn: async ({ pageParam }) => {
      return axiosInstance.post("/post/get-followed-posts", {
        username: dbUser?.username,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: dbUser?.following?.length > 0,
  });

  // Query to get recent posts
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage: fetchingRecentPosts,
  } = useInfiniteQuery({
    queryKey: ["recent-posts-home"],
    queryFn: async ({ pageParam }) => {
      return axiosInstance.post("/post/get-recent-posts", {
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled:
      posts?.pages?.[0]?.data?.posts.length == 0 ||
      dbUser?.following?.length == 0 ||
      posts == undefined ||
      dbUser == null,
  });

  //Fetch next posts
  useEffect(() => {
    if (
      posts == null ||
      posts == undefined ||
      posts?.pages[0]?.data?.posts?.length == 0
    ) {
      if (inView) {
        fetchNextPage();
      }
    } else {
      if (inView) {
        fetchFollowing();
      }
    }
  }, [inView, fetchNextPage, fetchFollowing, dbUser?.id]);

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="pb-32">
        <div className="p-5">
          {/* Title - Gradient text */}
          <h1 className="text-4xl font-semibold px-2 py-5">
            Welcome{" "}
            <span className="bg-gradient-to-r from-hovercta to-hovercta bg-clip-text text-transparent">
              {dbUser?.name ? dbUser?.name : "Journaler"}!
            </span>
          </h1>

          {/* Subtitle */}
          <h3 className="text-2xl font-semibold px-2">Let's start reading!</h3>
        </div>
        {dbUser?.following?.length > 0 &&
        posts?.pages?.[0]?.data?.posts.length > 0 ? (
          <div>
            {/* Mapping posts if available */}
            {posts && (
              <div className="mt-5">
                <p className="px-7 text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-cta to-hovercta">
                  From the people you follow:
                </p>
                <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-4 ">
                  {posts &&
                    posts?.pages?.map((page) => {
                      return page?.data?.posts?.map((post, index) => {
                        return <PostCard post={post} index={index} />;
                      });
                    })}
                </div>
              </div>
            )}

            {/* Error while fetching */}
            {followingError && (
              <div className="flex flex-col justify-center pt-10">
                <div className="flex justify-center">
                  <img src={homeNoPosts} className="max-w-[30%]" />
                </div>
                <p className="text-center mt-5 text-2xl font-medium">
                  Uh oh! Couldn't fetch posts.
                </p>
              </div>
            )}

            {/* No content found */}
            {posts &&
              (!posts?.pages || posts?.pages?.[0]?.data?.posts.length == 0) && (
                <div className="flex flex-col justify-center pt-10">
                  <div className="flex justify-center">
                    <img src={homeNoPosts} className="max-w-[30%]" />
                  </div>
                  <p className="text-center mt-5 text-2xl font-medium">
                    Uh oh! Couldn't fetch posts.
                  </p>
                </div>
              )}

            {(loading || fetchingFollowedPosts) && (
              <div className="h-96 flex justify-center items-center">
                <HashLoader
                  color={"#9b0ced"}
                  loading={loading || fetchingFollowedPosts}
                  size={100}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            )}

            {/* Fetch Next page div - infinite loading */}
            {data && <div ref={ref}></div>}

            {/* Read other posts by going to search page */}
            <div className="mt-10 flex justify-center">
              <p className="w-fit text-xl hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-b hover:from-cta hover:to-hovercta transition-all">
                You can read other recent posts by clicking on the search
                button!
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Loading indicator */}
            {/* Mapping posts if available */}
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

            {/* Error while fetching */}
            {error && (
              <div className="flex flex-col justify-center pt-10">
                <div className="flex justify-center">
                  <img src={homeNoPosts} className="max-w-[30%]" />
                </div>
                <p className="text-center mt-5 text-2xl font-medium">
                  Uh oh! Couldn't fetch posts.
                </p>
              </div>
            )}

            {/* No content found */}
            {data &&
              (!data?.pages || data?.pages?.[0]?.data?.posts.length == 0) && (
                <div className="flex flex-col justify-center pt-10">
                  <div className="flex justify-center">
                    <img src={homeNoPosts} className="max-w-[30%]" />
                  </div>
                  <p className="text-center mt-5 text-2xl font-medium">
                    Uh oh! Couldn't fetch posts.
                  </p>
                </div>
              )}

            {(isLoading || fetchingRecentPosts) && (
              <div className="h-96 flex justify-center items-center">
                <HashLoader
                  color={"#9b0ced"}
                  loading={isLoading || fetchingRecentPosts}
                  size={100}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            )}

            {/* Fetch Next page div - infinite loading */}
            {data && <div ref={ref}></div>}
          </div>
        )}
      </div>
      <div className="pt-20">
        <Footer />
      </div>
    </>
  );
};

export default Home;
