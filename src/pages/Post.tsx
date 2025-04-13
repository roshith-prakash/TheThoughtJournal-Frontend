/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import ReactQuill from "react-quill";
import { ErrorStatement, Input, OutlineButton } from "../components";
import Avvvatars from "avvvatars-react";
import { getMinsToRead } from "../functions/mathFunctions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import HashLoader from "react-spinners/HashLoader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { BsFillTrash3Fill, BsPen } from "react-icons/bs";
import { useDBUser } from "../context/userContext";
import { toast, Toaster } from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import { FiMessageCircle } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { GoReply } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

dayjs.extend(relativeTime);

// Comment Component
const Comment = ({
  comment,
  handleReply,
  pageIndex,
  commentIndex,
  loadMoreReplies,
  fetchDisable,
  repliesPageNumber,
  refetchComments,
  refetchPost,
  setRepliesPageNumber,
  currentUser,
  author,
}) => {
  const [disableDelete, setDisableDelete] = useState(false);
  const [modal, setModal] = useState(false);

  // Delete the comment (& replies if applicable)
  const deleteComment = () => {
    // Disable the delete button
    setDisableDelete(true);

    axiosInstance
      .post("/post/remove-comment", {
        commentId: comment?.id,
      })
      .then(() => {
        // Close the Modal
        setModal(false);
        // Refetch Post
        refetchPost();
        // Refetch comments
        refetchComments();
        // Reset page number object since comments are being refetched
        setRepliesPageNumber({});
        // Enable the button
        setDisableDelete(false);
        // Toast
        toast.success("Comment Deleted!");
      })
      .catch((err) => {
        // Log the error
        console.log(err);
        // Enable the button
        setDisableDelete(false);
        // Toast
        toast.error("Could not delete comment.");
      });
  };

  return (
    <div className="my-5 py-3 px-4 rounded-xl overflow-hidden shadow-lg dark:border-2 relative">
      <div className="flex justify-between">
        {/* Link to user's account */}
        <Link to={`/user/${comment?.User?.username}`} className="flex gap-x-4">
          {/* User Image or Avatar */}
          {comment?.User?.photoURL ? (
            <img
              src={comment?.User?.photoURL}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <Avvvatars size={50} value={comment?.User?.name} />
          )}

          {/* User's name & username */}
          <div>
            <p className="break-all font-medium">{comment?.User?.name}</p>
            <p className="break-all">@{comment?.User?.username}</p>
          </div>
        </Link>
        {/* Delete button - opens modal. */}
        {(comment?.userId == currentUser || author == currentUser) &&
          comment?.id && (
            <Dialog open={modal} onOpenChange={setModal}>
              <DialogTrigger>
                <BsFillTrash3Fill className="text-xl cursor-pointer text-red-600" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="dark:text-darkmodetext">
                    Do you want to delete this comment?
                  </DialogTitle>
                  <DialogDescription>
                    <p className="mt-5">
                      This action cannot be undone. This will permanently delete
                      your comment and all replies.
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-5">
                  <div className="w-fit">
                    <OutlineButton
                      text={
                        <div className="flex justify-center items-center text-red-600 gap-x-2">
                          <BsFillTrash3Fill className=" cursor-pointer text-red-600" />
                          Delete this comment.
                        </div>
                      }
                      disabled={disableDelete}
                      onClick={deleteComment}
                      disabledText="Please wait..."
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
      </div>
      {/* Comment time */}
      <p className="text-sm text-greyText mt-1 ml-16">
        {dayjs(comment?.createdAt).fromNow()}
      </p>
      {/* Comment */}
      <p className="mt-4 text-justify">{comment?.content}</p>
      {/* Button to reply */}
      <div className="mt-8 my-4 flex px-5">
        <button
          onClick={() => handleReply(comment)}
          className="flex gap-x-2 items-center hover:text-cta transition-all"
        >
          <GoReply />
          <p>Reply</p>
        </button>
      </div>
      {/* If reply to comment exists, render more comment objects */}
      {comment?.replies &&
        comment?.replies?.map((reply, i) => {
          return (
            <Comment
              key={i}
              comment={reply}
              handleReply={handleReply}
              pageIndex={pageIndex}
              commentIndex={commentIndex}
              loadMoreReplies={loadMoreReplies}
              fetchDisable={fetchDisable}
              repliesPageNumber={repliesPageNumber}
              refetchComments={refetchComments}
              refetchPost={refetchPost}
              setRepliesPageNumber={setRepliesPageNumber}
              author={author}
              currentUser={currentUser}
            />
          );
        })}

      {/* Load more replies button */}
      {comment?.replyCount > 0 &&
        repliesPageNumber[comment?.id] != "NoReply" &&
        comment.replyCount > comment?.replies?.length && (
          <button
            className="mx-4 my-4 disabled:text-greytext text-cta font-medium"
            onClick={() => {
              loadMoreReplies(pageIndex, commentIndex, comment?.id);
            }}
            disabled={fetchDisable}
          >
            {fetchDisable ? "Please Wait..." : "Load More Replies"}
          </button>
        )}
    </div>
  );
};

const Post = () => {
  const navigate = useNavigate();

  // Get Post Id from params.
  let { postId } = useParams();

  // Get user information
  const { dbUser } = useDBUser();

  // To disable delete button.
  const [disabled, setDisabled] = useState(false);

  // To like a post
  const [liked, setLiked] = useState(false);

  // To disable like Button
  const [disableLike, setDisableLike] = useState(false);

  // To disable send button
  const [disableSend, setDisableSend] = useState(false);

  // To input comment of the user
  const [comment, setComment] = useState("");

  // To input reply of the user
  const [reply, setReply] = useState(null);

  // To input reply of the user
  const [parentId, setParentId] = useState(null);

  // To remember page number for fetch replies
  const [repliesPageNumber, setRepliesPageNumber] = useState({});

  // Disable the fetch Reply button
  const [fetchDisable, setFetchDisable] = useState(false);

  // To display errors
  const [commentError, setCommentError] = useState(0);

  // Ref to take upto input box
  const replyRef = useRef<HTMLDivElement | null>();

  const { ref, inView } = useInView();

  const queryClient = useQueryClient();

  // Fetch data from server.
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["post-page", postId],
    queryFn: async () => {
      return axiosInstance.post("/post/get-post", { postId: postId });
    },
    refetchOnWindowFocus: false,
  });

  // Query to get comments for post
  const {
    data: comments,
    isLoading: loadingComments,
    // error: CommentsError,
    fetchNextPage,
    refetch: refetchComments,
  } = useInfiniteQuery({
    queryKey: ["comments", data?.data?.post?.id],
    queryFn: async ({ pageParam }) => {
      return axiosInstance.post("/post/get-comments", {
        postId: data?.data?.post?.id,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage;
    },
    enabled: !!data,
  });

  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = `${data?.data?.post?.title} | The Thought Journal`;
  }, [data]);

  //To set liked if post is already liked
  useEffect(() => {
    if (data?.data?.post?.likes.includes(dbUser?.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data?.post?.id, dbUser?.id]);

  // Fetch next comments
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  // To like the post
  const addLike = () => {
    if (!dbUser) {
      toast.error("You must be signed in to like a post!.");
      return;
    }

    if (!disableLike) {
      setDisableLike(true);

      axiosInstance
        .post("/post/likePost", {
          postId: data?.data?.post?.id,
          userId: dbUser?.id,
        })
        .then((res) => {
          console.log(res?.data);
          setLiked(true);
          setDisableLike(false);
          refetch();
        })
        .catch((err) => {
          setLiked(false);
          setDisableLike(false);
          console.log(err);
          toast.error("Something went wrong!");
        });
    }
  };

  // To like the post
  const removeLike = () => {
    if (!dbUser) {
      toast.error("You must be signed in to like a post!.");
      return;
    }

    if (!disableLike) {
      setDisableLike(true);

      axiosInstance
        .post("/post/unlikePost", {
          postId: data?.data?.post?.id,
          userId: dbUser?.id,
        })
        .then((res) => {
          console.log(res?.data);
          setLiked(false);
          setDisableLike(false);
          refetch();
        })
        .catch((err) => {
          setLiked(true);
          setDisableLike(false);
          console.log(err);
          toast.error("Something went wrong!");
        });
    }
  };

  // Handler to delete post.
  const deletePost = () => {
    setDisabled(true);
    axiosInstance
      .post("/post/delete-post", {
        postId: data?.data?.post?.id,
      })
      .then(() => {
        setDisabled(false);
        toast.success("Post deleted");
        queryClient.resetQueries({
          queryKey: ["getUserPosts", dbUser?.username],
        });
        navigate("/profile");
      })
      .catch((err) => {
        setDisabled(false);
        console.log(err);
        toast.error("Something went wrong.");
      });
  };

  // Handler to add comment.
  const handleComment = () => {
    // Check if user is signed in
    if (!dbUser) {
      toast.error("You must be signed in to comment!");
      return;
    }

    // Comment error
    setCommentError(0);

    // Check if comment is typed
    if (comment == undefined || comment == null || comment.length == 0) {
      setCommentError(1);
      return;
    }
    setDisableSend(true);
    // Call Api to add comment
    axiosInstance
      .post("/post/add-comment", {
        userId: dbUser?.id,
        postId: data?.data?.post?.id,
        content: comment,
        parentId: parentId,
      })
      .then(() => {
        // Reset state
        setComment("");
        setReply(null);
        setParentId(null);
        setDisableSend(false);
        setRepliesPageNumber({});
        // Refetch post
        refetch();
        // Refetch Comments
        refetchCommentsfunc();
        toast.success("Comment Added!");
      })
      .catch((err) => {
        console.log(err);
        setDisableSend(false);
        toast.error("Something went wrong!");
      });
  };

  // Handler to reply to comment.
  const handleReply = (comment) => {
    setReply(comment);
    setParentId(comment?.parentId ? comment?.parentId : comment?.id);
    replyRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Load More Replies
  const loadMoreReplies = (
    commentPageNumber,
    commentParentIndex,
    commentParentId
  ) => {
    // Disable fetch reply button
    setFetchDisable(true);

    // If page number exists for parentID
    if (repliesPageNumber[commentParentId]) {
      // Increment by 1
      setRepliesPageNumber((prev) => ({
        ...prev,
        [commentParentId]: repliesPageNumber[commentParentId] + 1,
      }));

      // Fetch next bunch of replies
      axiosInstance
        .post("/post/get-replies", {
          postId: data?.data?.post?.id,
          page: repliesPageNumber[commentParentId] + 1,
          parentId: commentParentId,
        })
        .then((res) => {
          console.log(res?.data);
          // Original array of replies
          const originalRepliesArray =
            comments.pages[commentPageNumber].data.comments[commentParentIndex]
              .replies;

          // Newly fetched array
          const repliesArray = res?.data?.replies;

          // Setting to no reply removes button
          if (res?.data?.nextPage == null) {
            setRepliesPageNumber((prev) => ({
              ...prev,
              [commentParentId]: "NoReply",
            }));
          }

          // Adding the newly fetched replies to the UI
          comments.pages[commentPageNumber].data.comments[
            commentParentIndex
          ].replies = [...originalRepliesArray, ...repliesArray];

          setFetchDisable(false);
        })
        .catch((err) => {
          console.log(err);
          setFetchDisable(false);
        });
    } else {
      // Initialize value to 1
      setRepliesPageNumber((prev) => ({
        ...prev,
        [commentParentId]: 1,
      }));

      // Call the API
      axiosInstance
        .post("/post/get-replies", {
          postId: data?.data?.post?.id,
          page: 1,
          parentId: commentParentId,
        })
        .then((res) => {
          console.log(res?.data);
          // Original array of replies
          const originalRepliesArray =
            comments.pages[commentPageNumber].data.comments[commentParentIndex]
              .replies;

          // Newly fetched array
          const repliesArray = res?.data?.replies;

          // Setting to no reply removes button
          if (res?.data?.nextPage == null) {
            setRepliesPageNumber((prev) => ({
              ...prev,
              [commentParentId]: "NoReply",
            }));
          }

          // Adding the newly fetched replies to the UI
          comments.pages[commentPageNumber].data.comments[
            commentParentIndex
          ].replies = [...originalRepliesArray, ...repliesArray];

          setFetchDisable(false);
        })
        .catch((err) => {
          console.log(err);
          setFetchDisable(false);
        });
    }
  };

  // Refetch post information
  const refetchPost = () => {
    refetch();
  };

  // Refetch comments
  const refetchCommentsfunc = () => {
    replyRef.current.scrollIntoView({ behavior: "smooth" });
    // Resetting query because new data doesnt show up otherwise.
    queryClient.resetQueries({
      queryKey: ["comments", data?.data?.post?.id],
    });
  };

  return (
    <div>
      {/* If data is being fetched */}
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

      {/* When post is available */}
      {data && data?.data?.post && (
        <div className="p-10">
          <div className="pb-10 m-2 md:m-5  bg-white shadow-xl border-[1px] dark:border-darkgrey dark:bg-darkgrey dark:text-darkmodetext overflow-hidden rounded-2xl">
            {/* Thumbnail Image */}
            <div>
              <img
                src={data?.data?.post?.thumbnail}
                className="max-h-96 lg:max-h-[30rem] w-full rounded-t object-cover object-center"
              ></img>
            </div>

            {/* Content */}
            <div className="p-5 max-w-5xl mx-auto md:p-10 md:pt-0 mt-8">
              {/* Badge */}
              <div className="flex justify-between items-center">
                <p className="bg-cta text-white dark:text-darkmodetext text-lg lg:text-xl rounded-full px-3 ml-3 py-1 w-fit">
                  {data?.data?.post?.category != "OTHER"
                    ? data?.data?.post?.category
                    : data?.data?.post?.otherCategory}
                </p>

                {data?.data?.post?.User?.username == dbUser?.username && (
                  <div className="lg:hidden flex items-center gap-x-5">
                    <Link
                      to="/editPost"
                      state={{ postId: data?.data?.post?.id }}
                    >
                      <BsPen className="text-xl" />
                    </Link>
                    <Dialog>
                      <DialogTrigger>
                        <BsFillTrash3Fill className="text-xl cursor-pointer text-red-600" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Do you want to delete this post?
                          </DialogTitle>
                          <DialogDescription>
                            <p className="mt-5">
                              This action cannot be undone. This will
                              permanently delete your post.
                            </p>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center mt-5">
                          <div className="w-fit">
                            <OutlineButton
                              text={
                                <div className="flex justify-center items-center text-red-600 gap-x-2">
                                  <BsFillTrash3Fill className=" cursor-pointer text-red-600" />
                                  Delete this post
                                </div>
                              }
                              disabled={disabled}
                              onClick={deletePost}
                              disabledText="Please wait..."
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {data?.data?.post?.User?.username == dbUser?.username && (
                  <div className="hidden lg:flex gap-x-8">
                    <Link
                      to="/editPost"
                      state={{ postId: data?.data?.post?.id }}
                      className="min-w-14 flex justify-center font-medium shadow-md py-2 px-5 rounded-lg w-full text-ink dark:text-darkmodetext dark:border-2 active:shadow transition-all disabled:text-greyText hover:scale-105"
                    >
                      <div className="flex items-center gap-x-2">
                        <BsPen className="text-xl" />
                        <p>Edit</p>
                      </div>
                    </Link>
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
                          <DialogTitle>
                            Do you want to delete this post?
                          </DialogTitle>
                          <DialogDescription>
                            <p className="mt-5">
                              This action cannot be undone. This will
                              permanently delete your post.
                            </p>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center mt-5">
                          <div className="w-fit">
                            <OutlineButton
                              text={
                                <div className="flex justify-center items-center text-red-600 gap-x-2">
                                  <BsFillTrash3Fill className=" cursor-pointer text-red-600" />
                                  Delete this post
                                </div>
                              }
                              onClick={deletePost}
                              disabled={disabled}
                              disabledText="Please wait..."
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>

              {/* Post Title */}
              <h1 className="mt-10 text-4xl px-3 tracking-tight lg:text-6xl font-bold text-ink dark:text-darkmodeCTA">
                {data?.data?.post?.title}
              </h1>

              {/* Post Author */}
              <Link
                to={`/user/${data?.data?.post?.User?.username}`}
                className="mt-14 hover:underline underline-offset-2 px-3 flex gap-x-4 text-xl items-center w-fit"
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
                  <p className="break-all">
                    @{data?.data?.post?.User?.username}
                  </p>
                </div>
              </Link>

              {/* Time required to read + post date */}
              <div className="mt-4 px-3.5 text-greyText font-medium">
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

              {/* Like + Share */}
              <div className="mt-10 border-t-2 px-3 py-10 ">
                <p className="mb-8 text-xl font-medium">
                  Enjoyed the post? Like & Share it!
                </p>
                <div className="flex gap-x-5">
                  {/* Like button  */}
                  <div className="flex flex-col items-center w-min px-2">
                    {liked ? (
                      <button onClick={removeLike} disabled={disableLike}>
                        <FaHeart
                          className={`text-3xl text-red-600 hover:scale-110 transition-all ${
                            disableLike && "text-red-300"
                          }`}
                        />
                      </button>
                    ) : (
                      <button onClick={addLike} disabled={disableLike}>
                        <FaRegHeart
                          className={`text-3xl hover:scale-110 transition-all ${
                            disableLike && "text-slate-500"
                          }`}
                        />
                      </button>
                    )}
                    <p
                      className={`mt-1 -ml-0.5 ${
                        disableLike && "text-slate-500"
                      }`}
                    >
                      {Intl.NumberFormat("en", { notation: "compact" }).format(
                        data?.data?.post?.likeCount
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-center w-min px-2">
                    <FiMessageCircle
                      onClick={() => {
                        replyRef.current.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="text-3xl cursor-pointer"
                    />
                    <p className={`mt-1 -ml-0.5`}>
                      {Intl.NumberFormat("en", { notation: "compact" }).format(
                        data?.data?.post?.commentCount
                      )}
                    </p>
                  </div>
                  {/* Share button - copies the post link */}
                  <LuSend
                    onClick={() => {
                      if (navigator?.clipboard) {
                        navigator.clipboard.writeText(location.href);
                        toast.success("Copied link to post!");
                      }
                    }}
                    className="text-[1.75rem] cursor-pointer hover:text-cta transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Comments section */}
            <div ref={replyRef} className="max-w-5xl mx-auto">
              <div className="p-5 md:p-10 md:pt-0 mt-8">
                {/* Title */}
                <p className="text-xl font-semibold">Comments</p>
                {/* Input box */}
                <div className="p-4">
                  {/* If replying to a comment, display the comment */}
                  {reply && (
                    <div className="bg-slate-50 dark:bg-darkgrey dark:border-2 my-5 py-3 px-4 rounded shadow relative">
                      <RxCross2
                        className="absolute top-8 text-xl right-5 cursor-pointer"
                        onClick={() => {
                          setReply(null);
                          setParentId(null);
                        }}
                      />
                      <p className="my-3 font-medium pb-3">Replying to :</p>
                      <div className="flex gap-x-4">
                        {/* User Image or Avatar */}
                        {reply?.User?.photoURL ? (
                          <img
                            src={reply?.User?.photoURL}
                            className="h-12 w-12 rounded-full"
                          />
                        ) : (
                          <Avvvatars size={50} value={reply?.User?.name} />
                        )}

                        {/* User's name & username */}
                        <div>
                          <p className="break-all font-medium">
                            {reply?.User?.name}
                          </p>
                          <p className="break-all">@{reply?.User?.username}</p>
                        </div>
                      </div>
                      <p className="text-sm text-greyText mt-1 ml-16">
                        {" "}
                        {dayjs(reply?.createdAt).fromNow()}
                      </p>
                      <p className="mt-4 text-justify">{reply?.content}</p>
                    </div>
                  )}

                  {/* Input box + send button */}
                  <div className="relative">
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your comment..."
                      className="pr-10"
                    />
                    {!disableSend ? (
                      <LuSend
                        onClick={handleComment}
                        className="absolute right-2 top-6 text-xl cursor-pointer hover:text-cta transiton-all"
                      />
                    ) : (
                      <AiOutlineLoading3Quarters className="absolute right-2 top-6 text-xl animate-spin" />
                    )}
                  </div>
                  {commentError == 1 && (
                    <ErrorStatement text={"Please type your comment."} />
                  )}
                </div>
              </div>

              {/* If comments are present, map the comments */}
              {comments && comments?.pages?.[0]?.data?.comments?.length > 0 && (
                <div className="mt-5 px-7">
                  {comments?.pages?.map((page, pageIndex) => {
                    return page?.data?.comments?.map(
                      (DBcomment, commentIndex) => {
                        return (
                          <Comment
                            key={commentIndex}
                            comment={DBcomment}
                            handleReply={handleReply}
                            pageIndex={pageIndex}
                            commentIndex={commentIndex}
                            loadMoreReplies={loadMoreReplies}
                            fetchDisable={fetchDisable}
                            repliesPageNumber={repliesPageNumber}
                            refetchComments={refetchComments}
                            refetchPost={refetchPost}
                            setRepliesPageNumber={setRepliesPageNumber}
                            author={data?.data?.post?.User?.id}
                            currentUser={dbUser?.id}
                          />
                        );
                      }
                    );
                  })}
                </div>
              )}

              {/* While loading comments */}
              {loadingComments && (
                <div className="py-20 flex w-full justify-center items-center">
                  <HashLoader
                    color={"#9b0ced"}
                    loading={loadingComments}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              )}

              {/* Ref for infinte querying comments */}
              <div ref={ref}></div>
            </div>
          </div>
        </div>
      )}

      {/* When post is NOT available */}
      {!isLoading && data?.data?.post == null && (
        <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh]  flex justify-center items-center">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              Uh oh. That post isn&apos;t available. Go Back?
            </p>
            <div className="mt-10 flex flex-col gap-10 justify-center items-center">
              {/* Image */}
              <img
                src={
                  "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736741174/exist_jm4kb5.svg"
                }
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
    </div>
  );
};

export default Post;
