import Avvvatars from "avvvatars-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

const PostCard = ({ post, index }) => {
  return (
    <div key={index} className="flex justify-center">
      <Link
        to={`/post/${post?.id}`}
        className="my-5 mx-5 pb-2 w-80 overflow-hidden rounded-lg cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        <img
          src={post?.thumbnail}
          className="h-60 w-full rounded-t-x object-top object-cover"
        />
        <div className="bg-gradient-to-br from-white to-bgwhite p-5">
          <p className="bg-cta text-white text-sm rounded-full px-3 py-1 w-fit">
            {post?.category != "OTHER" ? post?.category : post?.otherCategory}
          </p>
          <p className="ml-2 mt-3 text-2xl flex items-center font-medium overflow-hidden h-16 text-ellipsis">
            {post?.title.length < 30
              ? post?.title
              : post?.title.substring(0, 44) + "..."}
          </p>

          <p className="ml-2 my-5 text-sm overflow-hidden text-ellipsis text-greyText">
            Posted {dayjs(post?.createdAt).fromNow()}
          </p>

          <div className="mt-5 flex gap-x-3 items-center">
            {post?.User?.photoURL ? (
              <img
                src={post?.User?.photoURL}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <Avvvatars size={40} value={post?.User?.name} />
            )}

            <div>
              <Link to={`/user/${post?.User?.username}`}>
                <p className="break-all font-medium">{post?.User?.name}</p>
                <p className="break-all">@{post?.User?.username}</p>
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
