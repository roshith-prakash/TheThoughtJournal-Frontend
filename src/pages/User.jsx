import { useParams } from "react-router-dom";
import { Footer, Navbar, OutlineButton, PostCard } from "../components";
import { useDBUser } from "../context/userContext";
import defaultAccount from "../assets/account.png";
import dayjs from "dayjs";
import { TfiWrite } from "react-icons/tfi";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import Profile from "./Profile";
import userNotFound from "../assets/user.svg";
import HashLoader from "react-spinners/HashLoader";
import { useEffect } from "react";
import noPosts from "../assets/noposts.svg";

const User = () => {
  // Get Post Id from params.
  let { username } = useParams();

  const { dbUser } = useDBUser();

  if (username == dbUser?.username) {
    return <Profile />;
  } else {
    // Fetch user data from server.
    const {
      data: user,
      isLoading: loadingUser,
      error: userError,
    } = useQuery({
      queryKey: ["userProfile", username],
      queryFn: async () => {
        return axiosInstance.post("/auth/get-user-info", {
          username: username,
        });
      },
    });

    // Fetching the user's posts.
    const {
      data: posts,
      isLoading: loadingPosts,
      error: postsError,
    } = useQuery({
      queryKey: ["userPosts", username],
      queryFn: async () => {
        return axiosInstance.post("/post/get-user-posts", {
          username: username,
        });
      },
      enabled: !!user,
    });

    // Scroll to top
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    console.log(user);
    console.log(posts);

    return (
      <>
        <div className="max-w-screen overflow-hidden">
          <Navbar />
        </div>
        {/* If user is found */}

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

            {/* Posts div Title*/}
            {posts?.data?.posts.length > 0 && (
              <div className="mt-6 font-semibold flex items-center gap-x-6 px-3 text-3xl lg:text-5xl mx-5 md:mx-10 lg:mx-20">
                <TfiWrite />
                {user?.data?.user?.name}'s Journal Posts
              </div>
            )}

            {/* Mapping user's posts */}
            {posts?.data?.posts.length > 0 && (
              <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 mx-5 md:mx-10 lg:mx-20">
                {posts &&
                  posts?.data?.posts?.map((post, index) => {
                    return <PostCard post={post} index={index} />;
                  })}
              </div>
            )}

            {!loadingPosts && posts?.data?.posts.length == 0 && (
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
                  <OutlineButton onClick={() => navigate(-1)} text="Go Back" />
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
