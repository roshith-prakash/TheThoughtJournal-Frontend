import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import { useQuery } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import { Navbar } from "../components";

const Post = () => {
  let { postId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["todos", postId],
    queryFn: async () => {
      return axiosInstance.post("/post/get-post", { postId: postId });
    },
  });

  // Set window title.
  useEffect(() => {
    document.title = `${data?.data?.post?.title} | The Thought Journal`;
  }, [data]);

  console.log(data);

  return (
    <div className="bg-bgwhite">
      <Navbar />
      {data && (
        <div className="p-10 pb-20 m-10 bg-white shadow-xl border-[1px] rounded-xl">
          {/* Thumbnail Image */}
          <div className="">
            <img
              src={data?.data?.post?.thumbnail}
              className="max-h-96 w-full rounded object-contain object-center"
            ></img>
          </div>
          {/* Post Title */}{" "}
          <h1 className="mt-20 text-4xl lg:text-6xl font-bold text-ink">
            {data?.data?.post?.title}
          </h1>
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
      )}
    </div>
  );
};

export default Post;
