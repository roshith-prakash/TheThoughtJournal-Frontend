import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CalendarIcon, Clock, User2 } from "lucide-react";

dayjs.extend(relativeTime);

const PostCard = ({
  post,
}: {
  post: {
    uid: string;
    id: string;
    thumbnail: string;
    category?: string;
    otherCategory?: string;
    title: string;
    createdAt: Date;
    timeToRead: number;
    User: {
      name: string;
      username: string;
      photoURL: string;
    };
  };
}) => {
  // Determine which category to display
  const displayCategory =
    post?.category !== "OTHER" ? post?.category : post?.otherCategory;

  console.log(post);

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <Link
        to={`/post/${post?.uid}`}
        className="block outline-none font-body rounded-xl"
      >
        <div className="overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] border border-gray-200 dark:border-white/10 bg-[#fcfcfc] dark:bg-white/5">
          {/* Thumbnail Image */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={post?.thumbnail}
              alt={post?.title}
              className="w-full h-full bg-white object-cover transition-transform duration-500 hover:scale-105"
            />
            {/* Category Badge - Positioned on the image */}
            {displayCategory && (
              <div className="absolute top-4 left-4">
                <span className="inline-block font-semibold text-xs px-3 py-1 rounded-full bg-hovercta text-white">
                  {displayCategory.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 pb-2">
            {/* Post Title */}
            <h3 className="text-xl h-14 overflow-hidden font-semibold leading-tight line-clamp-2 tracking-tight text-gray-900 dark:text-gray-100">
              {post?.title}
            </h3>
          </div>

          <div className="px-4 pb-2">
            {/* Post Date */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="mr-1 h-3 w-3" />
              <span>{post?.timeToRead} min read</span>
            </div>
          </div>

          <div className="px-4 pb-2">
            {/* Post Date */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="mr-1 h-3 w-3" />
              <span>Posted {dayjs(post?.createdAt).fromNow()}</span>
            </div>
          </div>

          <div className="px-4 mt-2 py-4 border-t border-gray-100 dark:border-white/10">
            {/* Author Section */}
            <Link
              to={`/user/${post?.User?.username}`}
              className="flex items-center space-x-3 group w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                {post?.User?.photoURL ? (
                  <img
                    src={post?.User?.photoURL || "/placeholder.svg"}
                    alt={post?.User?.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium group-hover:underline text-gray-900 dark:text-gray-100">
                  {post?.User?.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  @{post?.User?.username}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
