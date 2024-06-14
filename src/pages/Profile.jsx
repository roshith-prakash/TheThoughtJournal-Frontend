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
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

const Profile = () => {
  const navigate = useNavigate();
  const { dbUser, setDbUser } = useDBUser();
  const [disabled, setDisabled] = useState(false);

  const { ref, inView } = useInView();

  // Set window title.
  useEffect(() => {
    document.title = `${dbUser?.name} | The Thought Journal`;
  }, []);

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Query to get posts
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["getUserPosts"],
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
    });

  // Fetch next page when end div reached.
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  // Delete the user
  const deleteUser = () => {
    setDisabled(true);
    const user = auth.currentUser;

    user
      .delete()
      .then(() => {
        axiosInstance
          .post("/auth/delete-user", { username: dbUser?.username })
          .then((res) => {
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
      <div className="lg:min-h-screenbg-bgwhite w-full pb-20">
        {/* Background color div */}
        <div className="bg-[#dcbbf0] border-b-4 border-black h-48"></div>

        {/* Profile Info Div */}
        <div className="bg-white shadow-xl -translate-y-14 border-2 min-h-52 pt-20 pb-10 rounded-lg mx-5 md:mx-10 lg:mx-20">
          {/* Floating Image */}
          <div className="absolute w-full -top-16 flex justify-center">
            <img
              src={dbUser?.photoURL ? dbUser?.photoURL : defaultAccount}
              className="bg-white rounded-full h-32 w-32 border-8 border-[#dcbbf0] pointer-events-none"
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

          {/* Name, Username and Bio */}
          <div className="px-2">
            <p className="text-center text-3xl font-bold">{dbUser?.name}</p>
            <p className="mt-2 text-center text-xl font-medium">
              @{dbUser?.username}
            </p>
            {dbUser?.bio && (
              <p className="px-4 my-10 text-md text-center">{dbUser?.bio}</p>
            )}
          </div>

          {/* Separator */}
          <hr className="my-5 mx-2" />

          {/* Day of joining */}
          <div className="mt-5 text-greyText flex justify-center items-center gap-x-2">
            <TfiWrite /> Became a Journaler on{" "}
            {dayjs(new Date(dbUser?.createdAt)).format("MMM DD, YYYY")}
          </div>
        </div>

        {/* Posts title */}
        {data?.pages?.[0]?.data?.posts.length > 0 && (
          <div className="mt-6 font-semibold flex items-center gap-x-6 px-3 text-3xl lg:text-5xl mx-5 md:mx-10 lg:mx-20">
            <TfiWrite />
            Your Journal Posts
          </div>
        )}

        {/* If posts are present - map the posts */}
        {data?.pages?.[0]?.data?.posts.length && (
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 mx-5 md:mx-10 lg:mx-10">
            {data?.pages?.map((page) => {
              return page?.data?.posts?.map((post, index) => {
                return <PostCard post={post} index={index} />;
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

        <div ref={ref}></div>
      </div>
      <div className="pt-32">
        <Footer />
      </div>
    </>
  );
};

export default Profile;
