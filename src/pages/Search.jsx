import React, { useEffect, useState } from "react";
import useDebounce from "../utils/useDebounce";
import { Footer, Input, Navbar, OutlineButton, PostCard } from "../components";
import { IoIosSearch } from "react-icons/io";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import Avvvatars from "avvvatars-react";
import { Link } from "react-router-dom";
import homeNoPosts from "../assets/homeNoPosts.svg";

const Search = () => {
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("posts");
  const debouncedSearch = useDebounce(search);

  const { ref, inView } = useInView();

  // Fetching searched Posts
  const {
    data: posts,
    isLoading: loadingPosts,
    error: postsError,
    fetchNextPage: fetchNextPosts,
  } = useInfiniteQuery({
    queryKey: ["searchPosts", debouncedSearch],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/post/searchPosts", {
        searchTerm: debouncedSearch,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled:
      debouncedSearch != null &&
      debouncedSearch != undefined &&
      debouncedSearch.length != 0 &&
      searchTerm == "posts",
  });

  // Fetching searched users
  const {
    data: users,
    isLoading: loadingUsers,
    error: usersError,
    fetchNextPage: fetchNextUsers,
  } = useInfiniteQuery({
    queryKey: ["searchUsers", debouncedSearch],
    queryFn: ({ pageParam }) => {
      return axiosInstance.post("/auth/searchUsers", {
        searchTerm: debouncedSearch,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled:
      debouncedSearch != null &&
      debouncedSearch != undefined &&
      debouncedSearch.length != 0 &&
      searchTerm == "users",
  });

  // Fetching next set of posts or users
  useEffect(() => {
    if (inView) {
      if (searchTerm == "posts") {
        fetchNextPosts();
      } else if (searchTerm == "users") {
        fetchNextUsers();
      }
    }
  }, [inView, fetchNextPosts, fetchNextUsers]);

  console.log(users);
  console.log(posts);

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] px-8 lg:px-10 py-10">
        <div>
          {/* Gradient Title */}
          <h1 className="bg-gradient-to-r from-cta to-hovercta bg-clip-text text-transparent text-4xl font-semibold">
            Search the Journal!
          </h1>

          {/* Input box */}
          <div className="flex justify-center">
            <div className="relative my-10 mt-14 w-full md:w-[80%] lg:w-[70%] flex justify-center">
              <IoIosSearch className="absolute left-2 top-6 text-greyText text-xl" />
              <Input
                value={search}
                type="text"
                className="pl-10"
                placeholder={"Search for posts or users!"}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Showing the input entered by the user */}
          {debouncedSearch && (
            <p className="font-medium">
              Showing search results for "{debouncedSearch}"
            </p>
          )}

          {/* Tabs to differentiate users & posts */}
          <Tabs className="mt-10" defaultValue="posts">
            <TabsList className="bg-transparent flex justify-center w-full">
              {/* Tab to select posts */}
              <TabsTrigger
                onClick={() => {
                  setSearchTerm("posts");
                }}
                value="posts"
                className={`${
                  searchTerm == "posts"
                    ? "text-cta border-b-2 border-cta"
                    : "text-ink border-b-2"
                } text-xl flex-1`}
              >
                Posts
              </TabsTrigger>
              {/* Tab to select users */}
              <TabsTrigger
                onClick={() => {
                  setSearchTerm("users");
                }}
                value="users"
                className={`${
                  searchTerm == "users"
                    ? "text-cta border-b-2 border-cta"
                    : "text-ink border-b-2"
                } text-xl flex-1 `}
              >
                Users
              </TabsTrigger>
            </TabsList>
            {/* Posts div */}
            <TabsContent value="posts">
              <div className="py-10 lg:px-5 grid grid-cols-1 md:grid-cols-2">
                {/* Map posts if posts are found */}
                {posts &&
                  posts?.pages?.map((page) => {
                    return page?.data.posts?.map((post, index) => {
                      if (post?.title) {
                        return <PostCard post={post} index={index} />;
                      }
                    });
                  })}

                {/* If no posts are found */}
                {searchTerm != null &&
                  searchTerm != undefined &&
                  searchTerm?.length > 0 &&
                  posts &&
                  posts?.pages?.[0]?.data?.posts.length == 0 && (
                    <div className="flex flex-col justify-center pt-10">
                      <div className="flex justify-center">
                        <img src={homeNoPosts} className="max-w-[30%]" />
                      </div>
                      <p className="text-center mt-5 text-2xl font-medium">
                        Uh oh! Couldn't find any posts.
                      </p>
                    </div>
                  )}
              </div>
              <div ref={ref}></div>
            </TabsContent>
            {/* Users div */}
            <TabsContent value="users">
              <div className="py-10 lg:px-5">
                {/* If users are present in DB */}
                {users &&
                  users?.pages?.map((page) => {
                    return page?.data.users?.map((user, index) => {
                      if (user?.name) {
                        return (
                          <Link
                            to={`/user/${user?.username}`}
                            className="py-5 px-4 flex gap-x-5 items-center rounded hover:bg-slate-100"
                          >
                            {user?.photoURL ? (
                              <img
                                src={user?.photoURL}
                                className="h-12 w-12 rounded-full"
                              />
                            ) : (
                              <Avvvatars size={50} value={user?.name} />
                            )}

                            <div className="flex-col gap-y-2">
                              <p className="text-lg font-medium">
                                {user?.name}
                              </p>
                              <p>@{user?.username}</p>
                            </div>
                          </Link>
                        );
                      }
                    });
                  })}

                {/* If no users couldn't be found */}
                {searchTerm != null &&
                  searchTerm != undefined &&
                  searchTerm?.length > 0 &&
                  users &&
                  users?.pages?.[0]?.data?.users.length == 0 && (
                    <div className="flex flex-col justify-center pt-10">
                      <div className="flex justify-center">
                        <img src={homeNoPosts} className="max-w-[30%]" />
                      </div>
                      <p className="text-center mt-5 text-2xl font-medium">
                        Uh oh! Couldn't find any users.
                      </p>
                    </div>
                  )}
              </div>
              <div ref={ref}></div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="pt-20">
        <Footer />
      </div>
    </>
  );
};

export default Search;
