import { useParams } from "react-router-dom";
import { CTAButton, Footer, Navbar, PostCard } from "../components";
import { useDBUser } from "../context/userContext";
import defaultAccount from "../assets/account.png";
import { BsPen } from "react-icons/bs";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { TfiWrite } from "react-icons/tfi";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import Profile from "./Profile";

const User = () => {
  // Get Post Id from params.
  let { username } = useParams();

  const { dbUser } = useDBUser();

  if (username == dbUser?.username) {
    return <Profile />;
  } else {
    // Fetch data from server.
    const {
      data: user,
      isLoading: loadingUser,
      error: userError,
    } = useQuery({
      queryKey: ["user", username],
      queryFn: async () => {
        return axiosInstance.post("/auth/get-user-info", {
          username: username,
        });
      },
    });

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

    console.log(user);
    console.log(posts);

    return (
      <>
        <div className="max-w-screen overflow-hidden">
          <Navbar />
        </div>
        <div className="lg:min-h-screenbg-bgwhite w-full pb-20">
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
              <p className="text-center text-3xl font-bold">
                {user?.data?.user?.name}
              </p>
              <p className="mt-2 text-center text-xl font-medium">
                @{user?.data?.user.username}
              </p>
              {user?.data?.user?.bio && (
                <p className="px-4 my-10 text-md text-center">
                  {user?.data?.user?.bio}
                </p>
              )}
            </div>

            <hr className="my-5 mx-2" />

            <div className="mt-5 text-greyText flex justify-center items-center gap-x-2">
              <TfiWrite /> Became a Journaler on{" "}
              {dayjs(new Date(user?.data?.user?.createdAt)).format(
                "MMM DD, YYYY"
              )}
            </div>
          </div>

          {/* Posts div */}
          <div className="mt-6 font-semibold flex items-center gap-x-6 px-3 text-3xl lg:text-5xl mx-5 md:mx-10 lg:mx-20">
            <TfiWrite />
            {user?.data?.user?.name}'s Journal Posts
          </div>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 mx-5 md:mx-10 lg:mx-20">
            {posts &&
              posts?.data?.posts?.map((post, index) => {
                return <PostCard post={post} index={index} />;
              })}
          </div>
        </div>
        <div className="hidden lg:block">
          <Footer />
        </div>
      </>
    );
  }
};

export default User;
