import { useParams } from "react-router-dom";
import { Footer, Navbar, OutlineButton, PostCard } from "../components";
import { useDBUser } from "../context/userContext";
import defaultAccount from "../assets/account.png";
import dayjs from "dayjs";
import { TfiWrite } from "react-icons/tfi";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import Profile from "./Profile";
import userNotFound from "../assets/user.svg";
import HashLoader from "react-spinners/HashLoader";
import { useEffect, useState } from "react";
import noPosts from "../assets/noposts.svg";
import { useInView } from "react-intersection-observer";
import { numberFormat } from "../functions/numberFormatter";
import { GoPlusCircle } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const User = () => {
  // Get Post Id from params.
  let { username } = useParams();

  const { dbUser, fetchUser } = useDBUser();

  const queryClient = useQueryClient();

  if (username == dbUser?.username) {
    return <Profile />;
  } else {
    const { ref, inView } = useInView();
    const [disabled, setDisabled] = useState(false);
    const [following, setFollowing] = useState(false);

    // Fetch user data from server.
    const {
      data: user,
      isLoading: loadingUser,
      error: userError,
      refetch,
    } = useQuery({
      queryKey: ["userProfile", username],
      queryFn: async () => {
        return axiosInstance.post("/auth/get-user-info", {
          username: username,
        });
      },
    });

    // Query to get posts
    const {
      data: posts,
      isLoading: loadingPosts,
      error,
      fetchNextPage,
      isFetchingNextPage: loadingNextPosts,
    } = useInfiniteQuery({
      queryKey: ["userPosts", username],
      queryFn: async ({ pageParam }) => {
        return axiosInstance.post("/post/get-user-posts", {
          username: user?.data?.user?.username,
          page: pageParam,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage?.data?.nextPage;
      },
      enabled: !!user,
    });

    // Set window title.
    useEffect(() => {
      document.title = `${user?.data?.user?.name} | The Thought Journal`;
    }, [user]);

    // Fetch next page when end div reached.
    useEffect(() => {
      if (inView) {
        fetchNextPage();
      }
    }, [inView, fetchNextPage]);

    // Scroll to top
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
      if (dbUser?.following.includes(user?.data?.user?.id)) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }, [user, dbUser?.following.length]);

    // To follow the user
    const followUser = () => {
      // Check if user is logged in
      if (!dbUser) {
        toast.error("You must be signed in to follow a user");
        return;
      } else {
        // Perform action only when button is not disabled
        if (!disabled) {
          setDisabled(true);

          // API call to add the user to the following list
          axiosInstance
            .post("/user/followUser", {
              userId: user?.data?.user?.id,
              currentUser: dbUser?.id,
            })
            .then((res) => {
              console.log(res?.data);
              toast.success(`Followed ${user?.data?.user?.username}!`);
              setDisabled(false);
              setFollowing(true);
              refetch();
              queryClient.removeQueries({
                queryKey: ["getUserFollowing", dbUser?.username],
              });
              fetchUser();
            })
            .catch((err) => {
              setFollowing(false);
              setDisabled(false);
              console.log(err);
              if (err.response.status === 409) {
                toast.error("You're already following the user!");
              } else {
                toast.error("Something went wrong!");
              }
            });
        }
      }
    };

    // To unfollow the user
    const unfollowUser = () => {
      // Check if user is logged in
      if (!dbUser) {
        toast.error("You must be signed in to follow a user");
        return;
      } else {
        // Perform action only when button is not disabled
        if (!disabled) {
          setDisabled(true);

          // API call to remove the user from the following list
          axiosInstance
            .post("/user/unfollowUser", {
              userId: user?.data?.user?.id,
              currentUser: dbUser?.id,
            })
            .then((res) => {
              console.log(res?.data);
              toast.success(`Unfollowed ${user?.data?.user?.username}!`);
              setDisabled(false);
              setFollowing(false);
              queryClient.removeQueries({
                queryKey: ["getUserFollowing", dbUser?.username],
              });
              refetch();
              fetchUser();
            })
            .catch((err) => {
              setFollowing(true);
              setDisabled(false);
              console.log(err);
              if (err.response.status === 409) {
                toast.error("You're not following the user!");
              } else {
                toast.error("Something went wrong!");
              }
            });
        }
      }
    };

    return (
      <>
        <Toaster />
        <div className="max-w-screen overflow-hidden">
          <Navbar />
        </div>
        {/* If data is being fetched*/}
        {loadingUser && (
          <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] p-20 pb-40 flex justify-center items-center">
            <HashLoader
              color={"#9b0ced"}
              loading={loadingUser}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}

        {/* If user was found */}
        {user && (
          <div className="lg:min-h-screen bg-bgwhite w-full pb-20">
            {/* Background color div */}
            <div className="bg-[#dcbbf0] border-b-4 border-black h-48"></div>

            {/* Profile Info Div */}
            <div className="bg-white shadow-xl -translate-y-14 border-2 min-h-52 pt-20 pb-10 rounded-lg mx-5 md:mx-10 lg:mx-20">
              {/* Floating Image */}
              <div className="absolute w-full -top-16 flex justify-center">
                <img
                  src={
                    user?.data?.user?.photoURL
                      ? user?.data?.user?.photoURL
                      : defaultAccount
                  }
                  className="bg-white rounded-full h-32 w-32 border-8 border-[#dcbbf0] pointer-events-none"
                />
              </div>

              {/* Follow / unfollow icon on small screen */}
              <div className="lg:hidden absolute flex gap-x-4 right-6 top-5">
                {following ? (
                  <button disabled={disabled} onClick={unfollowUser}>
                    {disabled ? (
                      <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                    ) : (
                      <RxCross2
                        className={`text-xl ${disabled && "text-slate-500"}`}
                      />
                    )}
                  </button>
                ) : (
                  <button disabled={disabled} onClick={followUser}>
                    {disabled ? (
                      <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                    ) : (
                      <GoPlusCircle
                        className={`text-xl ${disabled && "text-slate-500"}`}
                      />
                    )}
                  </button>
                )}
              </div>

              {/* Follow / unfollow button on large screen */}
              <div className="hidden absolute lg:flex gap-x-4 right-6 top-5">
                {following ? (
                  <OutlineButton
                    text={
                      <div className="flex items-center gap-x-2">
                        <p>Unfollow</p>
                        <RxCross2 />
                      </div>
                    }
                    disabled={disabled}
                    disabledText="Please Wait..."
                    onClick={unfollowUser}
                  />
                ) : (
                  <OutlineButton
                    text={
                      <div className="flex items-center gap-x-2">
                        <p>Follow</p>
                        <GoPlusCircle />
                      </div>
                    }
                    disabled={disabled}
                    disabledText="Please Wait..."
                    onClick={followUser}
                  />
                )}
              </div>

              <div className="px-2">
                {/* Name of the user */}
                <p className="text-center text-3xl font-bold">
                  {user?.data?.user?.name}
                </p>
                {/* Username of the user */}
                <p className="mt-2 text-center text-xl font-medium">
                  @{user?.data?.user.username}
                </p>
                {/* User's bio */}
                {user?.data?.user?.bio && (
                  <p className="px-4 my-10 text-md text-center">
                    {user?.data?.user?.bio}
                  </p>
                )}

                {/* Counts */}
                <div className="py-1 mt-4 flex justify-center items-center gap-x-8">
                  {/* Total Like Count */}
                  <div className="flex flex-col items-center gap-y-1">
                    <p>{numberFormat(user?.data?.user?.totalLikes)}</p>
                    <p className="text-md font-medium">Total Likes</p>
                  </div>

                  {/* Follower Count */}
                  <div className="flex flex-col items-center gap-y-1">
                    <p>{numberFormat(user?.data?.user?.followerCount)}</p>
                    <p className="text-md font-medium">Followers</p>
                  </div>

                  {/* Following Count */}
                  <div className="flex flex-col items-center gap-y-1">
                    <p>{numberFormat(user?.data?.user?.followingCount)}</p>
                    <p className="text-md font-medium">Following</p>
                  </div>
                </div>
              </div>

              <hr className="my-5 mx-2" />

              {/* Date when user joined the journal */}
              <div className="mt-5 text-greyText flex justify-center items-center gap-x-2">
                <TfiWrite /> Became a Journaler on{" "}
                {dayjs(new Date(user?.data?.user?.createdAt)).format(
                  "MMM DD, YYYY"
                )}
              </div>
            </div>

            {/* Posts title */}
            {posts?.pages?.[0]?.data?.posts.length > 0 && (
              <div className="mt-6 font-semibold flex items-center gap-x-6 px-3 text-3xl lg:text-5xl mx-5 md:mx-10 lg:mx-20">
                <TfiWrite />
                {user?.data?.user?.name}'s Journal Posts
              </div>
            )}

            {/* If posts are present - map the posts */}
            {posts?.pages?.[0]?.data?.posts.length > 0 && (
              <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 mx-5 md:mx-10 lg:mx-10">
                {posts?.pages?.map((page) => {
                  return page?.data?.posts?.map((post, index) => {
                    return <PostCard post={post} index={index} />;
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

            {/* If user does not have any posts */}
            {!loadingPosts && posts?.pages?.[0]?.data?.posts.length == 0 && (
              <div className="flex w-full justify-center items-center pb-32">
                <div>
                  <p className="font-medium text-2xl text-center ">
                    {user?.data?.user?.name} has not journalled any posts.
                  </p>
                  <div className="flex justify-center mt-16">
                    <img src={noPosts} className="max-w-[50%]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={ref}></div>
          </div>
        )}

        {/* If user cannot be found */}
        {!loadingUser && !user && (
          <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[60vh] flex justify-center items-center pb-48">
            <div>
              {/* Title for page */}
              <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
                Uh oh. We couldn't find that user. Go Back?
              </p>
              <div className="mt-10 flex flex-col gap-10 justify-center items-center">
                {/* Image */}
                <img
                  src={userNotFound}
                  className="max-w-[70%] lg:max-w-[60%] pointer-events-none"
                />
                {/* Button to navigate back */}
                <div className="w-[40%] lg:w-[30%]">
                  <OutlineButton
                    onClick={() => navigate("/")}
                    text="Go Back Home"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <Footer />
        </div>
      </>
    );
  }
};

export default User;
