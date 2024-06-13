import Avvvatars from "avvvatars-react";
import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const PostCard = ({ post, index }) => {
  return (
    // Card container
    <div key={index} className="flex justify-center">
      {/* Entire card is a link to post page to view the post */}
      <Link
        to={`/post/${post?.id}`}
        className="my-5 mx-5  w-full md:w-96 lg:w-80 overflow-hidden rounded-lg cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        {/* Thumbnail for post card. */}
        <img
          src={post?.thumbnail}
          className="h-60 w-full rounded-t-x object-top object-cover"
        />
        {/* Card Content Section */}
        <div className="bg-gradient-to-br from-white to-bgwhite p-5">
          {/* Badge for post category */}
          <p className="bg-cta text-white text-sm rounded-full px-3 py-1 w-fit">
            {post?.category != "OTHER" ? post?.category : post?.otherCategory}
          </p>
          {/* Post title - ellipsized if too long. */}
          <p className="ml-2 mt-3 text-2xl flex items-center font-medium h-16">
            {post?.title.length < 30
              ? post?.title
              : post?.title.substring(0, 40) + "..."}
          </p>

          {/* How long ago the post was posted. */}
          <p className="ml-2 my-5 text-sm overflow-hidden text-ellipsis text-greyText">
            Posted {dayjs(post?.createdAt).fromNow()}
          </p>

          {/* Author section - link to user's page. */}
          <Link
            to={`/user/${post?.User?.username}`}
            className="mt-5 flex gap-x-3 items-center w-fit"
          >
            {/* User's profile picture or avatar on left */}
            {post?.User?.photoURL ? (
              <img
                src={post?.User?.photoURL}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <Avvvatars size={40} value={post?.User?.name} />
            )}
            {/* User's name & username on the right */}
            <div>
              <p className="break-all font-medium">{post?.User?.name}</p>
              <p className="break-all">@{post?.User?.username}</p>
            </div>
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
