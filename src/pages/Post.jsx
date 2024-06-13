import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import { useQuery } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import { Footer, Navbar, OutlineButton } from "../components";
import Avvvatars from "avvvatars-react";
import { getMinsToRead } from "../functions/mathFunctions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import doesNotExist from "../assets/exist.svg";
import HashLoader from "react-spinners/HashLoader";

dayjs.extend(relativeTime);

const Post = () => {
  const navigate = useNavigate();
  // Get Post Id from params.
  let { postId } = useParams();

  // Fetch data from server.
  const { data, isLoading, error } = useQuery({
    queryKey: ["post-page", postId],
    queryFn: async () => {
      return axiosInstance.post("/post/get-post", { postId: postId });
    },
  });

  // Set window title.
  useEffect(() => {
    document.title = `${data?.data?.post?.title} | The Thought Journal`;
  }, [data]);

  console.log(data?.data?.post);

  return (
    <div className="bg-bgwhite min-h-screen">
      <Navbar />

      {isLoading && (
        <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh]  flex justify-center items-center">
          <HashLoader
            color={"#9b0ced"}
            loading={isLoading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {data && data?.data?.post && (
        <div className="pb-20 m-2 md:m-5 lg:m-10 bg-white shadow-xl border-[1px] rounded-xl">
          {/* Thumbnail Image */}
          <div>
            <img
              src={data?.data?.post?.thumbnail}
              className="h-96 lg:h-[30rem] w-full rounded-t object-cover object-center"
            ></img>
          </div>
          <div className="p-5 md:p-10 md:pt-0 mt-8">
            {/* Badge */}
            <p className="bg-cta text-white text-lg lg:text-xl rounded-full px-3 py-1 w-fit">
              {data?.data?.post?.category != "OTHER"
                ? data?.data?.post?.category
                : data?.data?.post?.otherCategory}
            </p>

            {/* Post Title */}
            <h1 className="mt-10 text-4xl lg:text-6xl font-bold text-ink">
              {data?.data?.post?.title}
            </h1>

            {/* Post Author */}

            <Link
              to={`/user/${data?.data?.post?.User?.username}`}
              className="mt-14 flex gap-x-4 text-xl items-center w-fit"
            >
              {/* User Image or Avatar */}
              {data?.data?.post?.User?.photoURL ? (
                <img
                  src={data?.data?.post?.User?.photoURL}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <Avvvatars size={50} value={data?.data?.post?.User?.name} />
              )}

              {/* User's name & username */}
              <div>
                <p className="break-all font-medium">
                  {data?.data?.post?.User?.name}
                </p>
                <p className="break-all">@{data?.data?.post?.User?.username}</p>
              </div>
            </Link>

            {/* Time required to read + post date */}
            <div className="mt-4 px-2 text-greyText font-medium">
              {getMinsToRead(data?.data?.post?.content)} min read | Posted on{" "}
              {dayjs(data?.data?.post?.createdAt).format("MMM DD, YYYY")}.
            </div>

            {/* Post Content */}
            <div className="mt-10">
              <ReactQuill
                value={data?.data?.post?.content}
                className="border-none postdisplay"
                theme="snow"
                readOnly
                modules={{ toolbar: null }}
              />
            </div>
          </div>
        </div>
      )}

      {!isLoading && data?.data?.post == null && (
        <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh]  flex justify-center items-center">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              Uh oh. That post isn't available. Go Back?
            </p>
            <div className="mt-10 flex flex-col gap-10 justify-center items-center">
              {/* Image */}
              <img
                src={doesNotExist}
                className="max-w-[50%] lg:max-w-[40%] pointer-events-none"
              />
              {/* Button to navigate back to home page */}
              <div className="w-[40%] lg:w-[30%]">
                <OutlineButton onClick={() => navigate(-1)} text="Go Back" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hidden mt-32 lg:block">
        <Footer />
      </div>
    </div>
  );
};

export default Post;
