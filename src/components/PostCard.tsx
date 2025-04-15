import Avvvatars from "avvvatars-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const PostCard = ({
  post,
}: {
  post: {
    id: string;
    thumbnail: string;
    category?: string;
    otherCategory?: string;
    title: string;
    createdAt: Date;
    User: {
      name: string;
      username: string;
      photoURL: string;
    };
  };
}) => {
  return (
    // Card container
    <div className="flex justify-center">
      {/* Entire card is a link to post page to view the post */}
      <Link
        to={`/post/${post?.id}`}
        className="my-5 mx-5 w-full max-w-lg overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent dark:border-white/15"
      >
        {/* Thumbnail for post card. */}
        <img
          src={post?.thumbnail}
          className="h-60 bg-white dark:bg-secondarydarkbg/25 w-full rounded-t-x object-top object-cover"
        />
        {/* Card Content Section */}
        <div className="bg-white dark:bg-secondarydarkbg/25 dark:text-darkmodetext p-5">
          {/* Badge for post category */}
          <p className="bg-cta text-white dark:text-darkmodetext text-xs rounded-full px-3 py-1 w-fit">
            {post?.category != "OTHER"
              ? post?.category?.toUpperCase()
              : post?.otherCategory?.toUpperCase()}
          </p>

          {/* Post title - ellipsized if too long. */}
          <p className="ml-1 mt-5 font-blogTitle tracking-[0.015em] text-2xl font-medium h-16 line-clamp-2 overflow-hidden">
            {post?.title}
          </p>

          {/* How long ago the post was posted. */}
          <p className="ml-1 my-5 text-xs overflow-hidden text-ellipsis text-greyText">
            Posted {dayjs(post?.createdAt).fromNow()}
          </p>

          {/* Author section - link to user's page. */}
          <Link
            to={`/user/${post?.User?.username}`}
            className="mt-5 hover:underline underline-offset-2 rounded py-2 pr-4 transition-all flex gap-x-3 items-center w-fit"
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
