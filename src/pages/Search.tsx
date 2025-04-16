import { useEffect, useState } from "react";
import useDebounce from "../utils/useDebounce";
import { Input, PostCard } from "../components";
import { IoIosSearch } from "react-icons/io";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import Avvvatars from "avvvatars-react";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const Search = () => {
  // State for user input - passed to debouncer
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("posts");
  // Debouncing the input of the user
  const debouncedSearch = useDebounce(search);

  // Intersection observer to fetch new posts
  const { ref, inView } = useInView();

  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetching searched Posts
  const {
    data: posts,
    isLoading: loadingPosts,
    // error: postsError,
    fetchNextPage: fetchNextPosts,
    isFetchingNextPage: loadingNextPosts,
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
    // error: usersError,
    fetchNextPage: fetchNextUsers,
    isFetchingNextPage: loadingNextUsers,
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
      // If posts tab is open - fetch the next posts.
      if (searchTerm == "posts") {
        fetchNextPosts();
      }
      // If users tab is open - fetch the next users.
      else if (searchTerm == "users") {
        fetchNextUsers();
      }
    }
  }, [
    inView,
    fetchNextPosts,
    fetchNextUsers,
    users?.pages?.length,
    posts?.pages?.length,
    searchTerm,
  ]);

  return (
    <>
      <div className="min-h-[70vh md:min-h-[65vh] lg:min-h-[60vh] px-8 lg:px-10 py-10">
        <div>
          {/* Gradient Title */}
          <h1 className="text-hovercta dark:text-darkmodeCTA text-4xl font-semibold">
            Search the Journal!
          </h1>

          {/* Input box */}
          <div className="flex justify-center">
            <div className="relative my-10 mt-14 w-full md:w-[80%] lg:w-[70%] flex justify-center">
              <IoIosSearch className="absolute left-2 top-6 text-greyText text-xl" />
              <Input
                value={search}
                className="pl-10"
                placeholder={"Search for posts or users!"}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Showing the input entered by the user */}
          {debouncedSearch && (
            <p className="font-medium">
              Showing search results for &quot;{debouncedSearch}&quot;
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
                    : "text-ink dark:text-darkmodetext border-b-2"
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
                    : "text-ink dark:text-darkmodetext border-b-2"
                } text-xl flex-1 `}
              >
                Users
              </TabsTrigger>
            </TabsList>
            {/* Posts div */}
            <TabsContent value="posts">
              {posts && posts?.pages?.[0]?.data?.posts.length > 0 && (
                <div className="py-10 grid md:grid-cols-2 lg:grid-cols-4">
                  {/* Map posts if posts are found */}
                  {posts &&
                    posts?.pages?.map((page) => {
                      return page?.data.posts?.map((post) => {
                        if (post?.title) {
                          return (
                            <div data-aos="fade-up" key={post?.id}>
                              <PostCard post={post} />
                            </div>
                          );
                        }
                      });
                    })}
                </div>
              )}

              {(loadingPosts || loadingNextPosts) && (
                <div className="flex justify-center items-center py-10">
                  <HashLoader
                    color={"#9b0ced"}
                    loading={loadingPosts || loadingNextPosts}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              )}

              {/* If no posts are found */}
              {searchTerm != null &&
                searchTerm != undefined &&
                searchTerm?.length > 0 &&
                posts &&
                posts?.pages?.[0]?.data?.posts.length == 0 && (
                  <div className="flex flex-col justify-center pt-10">
                    <div className="flex justify-center">
                      <img
                        src={
                          "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736740067/homeNoPosts_bxhmtk.svg"
                        }
                        className="max-w-[30%]"
                      />
                    </div>
                    <p className="text-center mt-5 text-2xl font-medium">
                      Uh oh! Couldn&apos;t find any posts.
                    </p>
                  </div>
                )}
              <div ref={ref}></div>
            </TabsContent>
            {/* Users div */}
            <TabsContent value="users">
              <div className="py-10 lg:px-5">
                {/* If users are present in DB */}
                {users &&
                  users?.pages?.map((page) => {
                    return page?.data.users?.map((user) => {
                      if (user?.name) {
                        return (
                          <div key={user?.username} data-aos="fade-up">
                            <Link
                              to={`/user/${user?.username}`}
                              className="py-5 px-4 flex gap-x-5 items-center rounded transition-all hover:bg-black/5 dark:hover:bg-darkgrey"
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
                          </div>
                        );
                      }
                    });
                  })}

                <div ref={ref}></div>

                {(loadingUsers || loadingNextUsers) && (
                  <div className="flex justify-center items-center py-10">
                    <HashLoader
                      color={"#9b0ced"}
                      loading={loadingUsers || loadingNextUsers}
                      size={100}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                )}

                {/* If no users couldn't be found */}
                {searchTerm != null &&
                  searchTerm != undefined &&
                  searchTerm?.length > 0 &&
                  users &&
                  users?.pages?.[0]?.data?.users.length == 0 && (
                    <div className="flex flex-col justify-center pt-10">
                      <div className="flex justify-center">
                        <img
                          src={
                            "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736740067/homeNoPosts_bxhmtk.svg"
                          }
                          className="max-w-[30%]"
                        />
                      </div>
                      <p className="text-center mt-5 text-2xl font-medium">
                        Uh oh! Couldn&apos;t find any users.
                      </p>
                    </div>
                  )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Search;
