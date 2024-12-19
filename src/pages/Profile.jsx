import {
  CTAButton,
  Footer,
  Navbar,
  OutlineButton,
  PostCard,
} from "../components";
import { useDBUser } from "../context/userContext";
import defaultAccount from "../assets/account.png";
import { BsPen, BsFillTrash3Fill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { TfiWrite } from "react-icons/tfi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import noPosts from "../assets/noposts.svg";
import { auth } from "../firebase/firebase";
import { Toaster, toast } from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { numberFormat } from "../functions/numberFormatter";
import Avvvatars from "avvvatars-react";
import homeNoPosts from "../assets/homeNoPosts.svg";
import HashLoader from "react-spinners/HashLoader";

const Profile = () => {
  const navigate = useNavigate();
  const { dbUser, setDbUser } = useDBUser();
  const [disabled, setDisabled] = useState(false);
  const [tabValue, setTabValue] = useState("userPosts");
  const [followerOpen, setFollowerOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const { ref, inView } = useInView();
  const { ref: ref2, inView: inView2 } = useInView();

  // Set window title.
  useEffect(() => {
    document.title = `${dbUser?.name} | The Thought Journal`;
  }, [dbUser]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Query to get posts
  const {
    data,
    isLoading,
    // error,
    fetchNextPage,
    isFetchingNextPage: loadingNextPosts,
  } = useInfiniteQuery({
    queryKey: ["getUserPosts", dbUser?.username],
    queryFn: async ({ pageParam }) => {
      return axiosInstance.post("/post/get-user-posts", {
        username: dbUser?.username,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: tabValue == "likedPosts",
  });

  // Query to get liked posts
  const {
    data: likedPosts,
    isLoading: loadingLikedPosts,
    // error: likedPostsError,
    fetchNextPage: fetchLikedPosts,
    isFetchingNextPage: loadingNextLikedPosts,
  } = useInfiniteQuery({
    queryKey: ["getUserLikedPosts", dbUser?.username],
    queryFn: async ({ pageParam }) => {
      return axiosInstance.post("/post/get-liked-posts", {
        username: dbUser?.username,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: tabValue == "likedPosts",
  });

  // Query to get followers
  const {
    data: followers,
    isLoading: loadingFollowers,
    // error: followersError,
    fetchNextPage: fetchFollowers,
  } = useInfiniteQuery({
    queryKey: ["getUserFollowers", dbUser?.username],
    queryFn: async ({ pageParam }) => {
      return axiosInstance.post("/user/get-followers", {
        username: dbUser?.username,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: followerOpen,
  });

  // Query to get following list
  const {
    data: following,
    isLoading: loadingFollowing,
    // error: followingError,
    fetchNextPage: fetchFollowing,
  } = useInfiniteQuery({
    queryKey: ["getUserFollowing", dbUser?.username],
    queryFn: async ({ pageParam }) => {
      return axiosInstance.post("/user/get-following", {
        username: dbUser?.username,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: followingOpen,
  });

  // Fetch next page when end div reached.
  useEffect(() => {
    if (tabValue == "userPosts") {
      if (inView) {
        fetchNextPage();
      }
    }

    if (tabValue == "likedPosts") {
      if (inView) {
        fetchLikedPosts();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, fetchNextPage]);

  // Fetch followers & following
  useEffect(() => {
    if (followingOpen) {
      if (inView2) {
        fetchFollowing();
      }
    }

    if (followerOpen) {
      if (inView2) {
        fetchFollowers();
      }
    }
  }, [inView2, fetchFollowers, fetchFollowing, followingOpen, followerOpen]);

  // Delete the user
  const deleteUser = () => {
    setDisabled(true);
    const user = auth.currentUser;

    user
      .delete()
      .then(() => {
        axiosInstance
          .post("/auth/delete-user", { username: dbUser?.username })
          .then(() => {
            toast.success("User Deleted.");
            setDbUser(null);
            setDisabled(false);
            navigate("/");
          })
          .catch((err) => {
            setDisabled(false);
            console.log(err);
            toast.error("Something went wrong.");
          });
      })
      .catch((error) => {
        setDisabled(false);
        console.log(error);
        const errorMessage = error?.message;
        if (String(errorMessage).includes("auth/requires-recent-login")) {
          toast.error("Please login again before deleting your account.");
        } else {
          toast.error("Something went wrong.");
        }
      });

    // Deleting user from firebase
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="lg:min-h-screen bg-bgwhite dark:bg-darkbg dark:text-darkmodetext w-full pb-20">
        {/* Background color div */}
        <div className="bg-[#cf86f9] dark:bg-darkgrey border-b-4 border-black h-48"></div>

        {/* Profile Info Div */}
        <div className="bg-white dark:bg-darkgrey shadow-xl -translate-y-14 border-2 min-h-52 pt-20 pb-10 rounded-lg mx-5 md:mx-10 lg:mx-20">
          {/* Floating Image */}
          <div className="absolute w-full -top-16 flex justify-center">
            <img
              src={dbUser?.photoURL ? dbUser?.photoURL : defaultAccount}
              className="bg-white rounded-full h-32 w-32 border-8 border-[#cf86f9] dark:border-darkgrey pointer-events-none"
            />
          </div>

          {/* Edit & delete icon on small screen */}
          <div className="lg:hidden absolute flex gap-x-4 right-6 top-5">
            <BsPen
              className="text-xl cursor-pointer"
              onClick={() => navigate("/editProfile")}
            />
            <Dialog>
              <DialogTrigger>
                <BsFillTrash3Fill className="text-xl cursor-pointer text-red-600" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    <p className="mt-5">
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-8">
                  <div className="w-fit">
                    <OutlineButton
                      text={
                        <div className="flex justify-center items-center text-red-600 gap-x-2">
                          <BsFillTrash3Fill className=" cursor-pointer text-red-600" />
                          Delete your account
                        </div>
                      }
                      onClick={deleteUser}
                      disabled={disabled}
                      disabledText="Please wait..."
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit & delete button on large screen */}
          <div className="hidden absolute lg:flex gap-x-4 right-6 top-5">
            <CTAButton
              text={
                <div className="flex items-center gap-x-2">
                  <BsPen />
                  <p>Edit</p>
                </div>
              }
              onClick={() => navigate("/editProfile")}
            />
            <Dialog>
              <DialogTrigger>
                <OutlineButton
                  text={
                    <div className="flex items-center gap-x-2">
                      <BsFillTrash3Fill className="text-xl cursor-pointer text-red-600" />
                      <p>Delete</p>
                    </div>
                  }
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    <p className="mt-5">
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-8">
                  <div className="w-fit">
                    <OutlineButton
                      text={
                        <div className="flex justify-center items-center text-red-600 gap-x-2">
                          <BsFillTrash3Fill className=" cursor-pointer text-red-600" />
                          Delete your account
                        </div>
                      }
                      onClick={deleteUser}
                      disabled={disabled}
                      disabledText="Please wait..."
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Name, Username and Bio + Stat Count */}
          <div className="px-2">
            <p className="text-center text-3xl font-bold">{dbUser?.name}</p>
            <p className="mt-2 text-center text-xl font-medium">
              @{dbUser?.username}
            </p>
            {dbUser?.bio && (
              <p className="px-4 my-10 text-md text-center">{dbUser?.bio}</p>
            )}

            {/* Counts */}
            <div className="py-1 flex justify-center items-center gap-x-8">
              {/* Total Like Count */}
              <div className="flex flex-col items-center gap-y-1">
                <p>{numberFormat(dbUser?.totalLikes)}</p>
                <p className="text-md font-medium">Total Likes</p>
              </div>

              {/* Follower Count */}
              <Dialog open={followerOpen} onOpenChange={setFollowerOpen}>
                <DialogTrigger>
                  <div className="flex flex-col items-center gap-y-1 p-1 transition-all cursor-pointer rounded hover:bg-slate-100 dark:hover:bg-darkbg">
                    <p>{numberFormat(dbUser?.followerCount)}</p>
                    <p className="text-md font-medium">Followers</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="h-96 overflow-y-auto  dark:text-darkmodetext">
                  <DialogHeader>
                    <DialogTitle>Followers</DialogTitle>
                    <DialogDescription>
                      <div className="mt-5 text-black">
                        {/* Loading indicator */}
                        {loadingFollowers && (
                          <div className="flex h-full pt-20 justify-center items-center">
                            <HashLoader
                              color={"#9b0ced"}
                              loading={loadingFollowers}
                              size={80}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          </div>
                        )}
                        {/* If no users couldn't be found */}
                        {followers &&
                          followers?.pages?.[0]?.data?.users.length == 0 && (
                            <div className="flex flex-col justify-center pt-10">
                              <div className="flex justify-center">
                                <img
                                  src={homeNoPosts}
                                  className="max-w-[50%]"
                                />
                              </div>
                              <p className="text-center mt-5 text-xl font-medium">
                                You do not have any followers.
                              </p>
                            </div>
                          )}

                        {/* If users are present in DB */}
                        {followers &&
                          followers?.pages?.map((page) => {
                            return page?.data.users?.map((user) => {
                              if (user?.name) {
                                return (
                                  <Link
                                    key={user?.username}
                                    to={`/user/${user?.username}`}
                                    className="py-3 px-4 flex gap-x-5 items-center rounded hover:bg-slate-100 dark:hover:bg-darkgrey dark:text-darkmodetext"
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
                      </div>
                      <div ref={ref2}></div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              {/* Following Count */}
              <Dialog open={followingOpen} onOpenChange={setFollowingOpen}>
                <DialogTrigger>
                  <div className="flex flex-col items-center gap-y-1 p-1 transition-all cursor-pointer rounded hover:bg-slate-100 dark:hover:bg-darkbg">
                    <p>{numberFormat(dbUser?.followingCount)}</p>
                    <p className="text-md font-medium">Following</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="h-96 overflow-y-auto dark:text-darkmodetext">
                  <DialogHeader>
                    <DialogTitle>Following</DialogTitle>
                    <DialogDescription>
                      <div className="mt-5 text-black">
                        {/* Loading indicator */}
                        {loadingFollowing && (
                          <div className="flex h-full pt-20 justify-center items-center">
                            <HashLoader
                              color={"#9b0ced"}
                              loading={loadingFollowing}
                              size={80}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          </div>
                        )}
                        {/* If users are present in DB */}
                        {following &&
                          following?.pages?.map((page) => {
                            return page?.data.users?.map((user) => {
                              if (user?.name) {
                                return (
                                  <Link
                                    key={user?.username}
                                    to={`/user/${user?.username}`}
                                    className="py-3 px-4 flex gap-x-5 items-center rounded hover:bg-slate-100 dark:hover:bg-darkgrey dark:text-darkmodetext"
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
                        {following &&
                          following?.pages?.[0]?.data?.users.length == 0 && (
                            <div className="flex flex-col justify-center pt-10">
                              <div className="flex justify-center">
                                <img
                                  src={homeNoPosts}
                                  className="max-w-[50%]"
                                />
                              </div>
                              <p className="text-center mt-5 text-xl font-medium">
                                You do not follow any users.
                              </p>
                            </div>
                          )}
                      </div>
                      <div ref={ref2}></div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Separator */}
          <hr className="my-5 mx-2" />

          {/* Day of joining */}
          <div className="mt-5 text-greyText flex justify-center items-center gap-x-2">
            <TfiWrite /> Became a Journaler on{" "}
            {dayjs(new Date(dbUser?.createdAt)).format("MMM DD, YYYY")}
          </div>
        </div>

        <Tabs defaultValue="userPosts" className="w-full">
          <TabsList className="bg-transparent flex justify-center w-full">
            <TabsTrigger
              onClick={() => setTabValue("userPosts")}
              value="userPosts"
              className={`${
                tabValue == "userPosts"
                  ? "text-cta border-b-2 border-cta"
                  : "text-ink dark:text-darkmodetext border-b-2"
              } text-xl flex-1 py-3`}
            >
              Your Posts
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setTabValue("likedPosts")}
              value="likedPosts"
              className={`${
                tabValue == "likedPosts"
                  ? "text-cta border-b-2 border-cta"
                  : "text-ink dark:text-darkmodetext border-b-2"
              } text-xl flex-1 py-3`}
            >
              Liked Posts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="userPosts" className="py-10">
            {/* Posts title */}
            {data?.pages?.[0]?.data?.posts.length > 0 && (
              <div className="mt-6 font-semibold flex items-center gap-x-6 px-3 text-3xl lg:text-5xl mx-5 md:mx-10 lg:mx-20">
                <TfiWrite />
                Your Journal Posts
              </div>
            )}

            {/* If posts are present - map the posts */}
            {data?.pages?.[0]?.data?.posts.length > 0 && (
              <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 mx-5 md:mx-10 lg:mx-10">
                {data?.pages?.map((page) => {
                  return page?.data?.posts?.map((post, index) => {
                    return <PostCard key={index} post={post} index={index} />;
                  });
                })}
              </div>
            )}

            {/* If no posts were created by the user */}
            {!isLoading && data?.pages?.[0]?.data?.posts.length == 0 && (
              <div className="flex w-full justify-center items-center">
                <div>
                  <p className="font-medium text-2xl text-center ">
                    You have not journalled any posts.
                  </p>
                  <div className="flex justify-center mt-16">
                    <img src={noPosts} className="max-w-[50%]" />
                  </div>
                  <div className="mt-20 flex justify-center">
                    <div className="max-w-[50%]">
                      <CTAButton
                        text={<p className="text-xl">Create a Post</p>}
                        onClick={() => navigate("/addPost")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* loading indicator */}
            {(isLoading || loadingNextPosts) && (
              <div className="flex pt-10 justify-center items-center">
                <HashLoader
                  color={"#9b0ced"}
                  loading={isLoading || loadingNextPosts}
                  size={80}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="likedPosts" className="py-10">
            {/* Posts title */}

            {likedPosts?.pages?.[0]?.data?.posts.length > 0 &&
              likedPosts?.pages?.[0]?.data?.posts[0] != null && (
                <div className="mt-6 font-semibold flex items-center gap-x-6 px-3 text-3xl lg:text-5xl mx-5 md:mx-10 lg:mx-20">
                  <TfiWrite />
                  Your Liked Posts
                </div>
              )}

            {/* If posts are present - map the posts */}
            {likedPosts?.pages?.[0]?.data?.posts.length > 0 &&
              likedPosts?.pages?.[0]?.data?.posts[0] != null && (
                <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 mx-5 md:mx-10 lg:mx-10">
                  {likedPosts?.pages?.map((page) => {
                    return page?.data?.posts?.map((post, index) => {
                      if (post) {
                        return (
                          <PostCard key={index} post={post} index={index} />
                        );
                      }
                    });
                  })}
                </div>
              )}

            {/* If no posts were created by the user */}
            {!loadingLikedPosts &&
              (likedPosts?.pages?.[0]?.data?.posts.length == 0 ||
                likedPosts?.pages?.[0]?.data?.posts[0] == null) && (
                <div className="flex w-full justify-center items-center">
                  <div>
                    <p className="font-medium text-2xl text-center ">
                      You have not liked any posts.
                    </p>
                    <div className="flex justify-center mt-16">
                      <img src={noPosts} className="max-w-[50%]" />
                    </div>
                  </div>
                </div>
              )}

            {/* Loading indicator */}
            {(loadingLikedPosts || loadingNextLikedPosts) && (
              <div className="flex pt-10 justify-center items-center">
                <HashLoader
                  color={"#9b0ced"}
                  loading={loadingLikedPosts || loadingNextLikedPosts}
                  size={80}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div ref={ref}></div>
      </div>
      <div className="pt-32 dark:bg-darkbg">
        <Footer />
      </div>
    </>
  );
};

export default Profile;
