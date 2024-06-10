import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  CTAButton,
  ErrorStatement,
  Input,
  Navbar,
  OutlineButton,
} from "../components";
import gallery from "../assets/gallery.png";
import { isEditorEmpty } from "../functions/regexFunctions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { categories } from "../data/categories";
import { FaArrowDown } from "react-icons/fa6";
import { axiosInstance } from "../utils/axios";
import { useAuth } from "../context/authContext";
import { toast, Toaster } from "react-hot-toast";

const CreatePost = () => {
  // Current user from firebase auth
  const { currentUser } = useAuth();
  // Ref for file input
  const fileRef = useRef();
  // State for text editor input
  const [value, setValue] = useState();
  // State for disabling button
  const [disabled, setDisabled] = useState(false);
  // State for adding image
  const [imageFile, setImageFile] = useState();
  // State for adding title of post
  const [title, setTitle] = useState();
  // State for selecting post category
  const [category, setCategory] = useState();
  // State for adding category if "other" was selected
  const [otherCategory, setOtherCategory] = useState();
  // Error states
  const [error, setError] = useState({
    title: 0,
    category: 0,
    image: 0,
    content: 0,
    other: 0,
  });

  // Scroll to top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Create a new Post | The Thought Journal";
  }, []);

  // To save the post
  const handleSave = () => {
    setError({
      title: 0,
      category: 0,
      image: 0,
      content: 0,
    });

    // Check if title is empty
    if (title == null || title == undefined || title.length <= 0) {
      setError((prev) => ({ ...prev, title: 1 }));
      return;
    }
    // Check if image has been added
    else if (imageFile == null || imageFile == undefined) {
      setError((prev) => ({ ...prev, image: 1 }));
      return;
    }
    // Check if category has been selected
    else if (category == null || category == undefined) {
      setError((prev) => ({ ...prev, category: 1 }));
      return;
    }
    // Check if category has been added if "OTHER" was selected
    else if (category == "OTHER") {
      if (
        otherCategory == null ||
        otherCategory == undefined ||
        otherCategory.length <= 0
      ) {
        setError((prev) => ({ ...prev, other: 1 }));
        return;
      }
    }

    // Check if content has been added for blog
    if (isEditorEmpty(value)) {
      setError((prev) => ({ ...prev, content: 1 }));
      return;
    }

    // Adding data to FormData object
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("otherCategory", otherCategory);
    formData.append("content", String(value));
    formData.append("user", JSON.stringify(currentUser));
    setDisabled(true);

    // Sending request to server
    axiosInstance
      .post("/post/create-post", formData, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Post created!");
        setDisabled(false);
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        console.log(err);
        setDisabled(false);
      });
  };

  // To get image input
  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setImageFile(e.target.files[0]);
    fileRef.current.value = null;
  };

  return (
    <div className="bg-bgwhite">
      <Navbar />
      <Toaster />

      {/* Editor box */}
      <div className="p-10 pb-20 m-5 lg:m-10 bg-white shadow-xl border-[1px] rounded-xl">
        {/* Title */}
        <h1 className="text-2xl lg:text-4xl text-center font-medium">
          Create a new Journal post{" "}
        </h1>
        <p className="text-base mt-2 lg:text-xl text-center">
          (You can preview your post below!)
        </p>

        {/* Input fields */}
        {/* Horizontal Flex on larger screens */}
        <div className="mt-10 lg:mt-24 lg:flex lg:gap-x-16">
          {/* Add Post title */}
          <div className="lg:flex-1">
            <p className="font-medium">Title</p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={"Enter the title of your post"}
            />
            {error.title == 1 && (
              <ErrorStatement text={"Please enter the title of your post."} />
            )}
          </div>

          {/* Add Post thumbnail image */}
          <div className="mt-8 lg:mt-0 lg:flex-1">
            <p className="font-medium">Thumbnail</p>
            {/* Hidden input box - used to accept images */}
            <input
              className="hidden"
              type="file"
              ref={fileRef}
              accept="image/.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            {/* Flex div - button & image name */}
            <div className="mt-3 flex flex-col gap-y-2 md:gap-y-0 md:flex-row md:gap-x-5 items-center">
              <div className="w-full md:flex-1">
                {/* Button to open file input  */}
                <OutlineButton
                  text={
                    <p className="flex gap-x-3 justify-center items-center">
                      Select your image
                      {/* Icon */}
                      <img src={gallery} className="h-5" />
                    </p>
                  }
                  onClick={() => fileRef.current.click()}
                />
              </div>
              {/* Display file name */}
              <p className="flex-1 overflow-hidden">{imageFile?.name}</p>
            </div>
            {error.image == 1 && (
              <ErrorStatement text={"Please add an image for your post."} />
            )}
          </div>
        </div>

        {/* Category select */}
        <div className="my-8 flex flex-col gap-y-5 lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-5">
          <p className="font-medium">Post Category</p>
          <Select
            onValueChange={(selectedCategory) => setCategory(selectedCategory)}
          >
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => {
                return <SelectItem value={category}>{category}</SelectItem>;
              })}
            </SelectContent>
          </Select>

          {error.category == 1 && (
            <ErrorStatement text={"Please select a category for your post."} />
          )}
        </div>

        {/* Other Category */}
        {category == "OTHER" && (
          <div className="lg:max-w-[48%]">
            <p className="font-medium">Specify the Category</p>
            <Input
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              placeholder={"Enter the category for your post"}
            />
            {error.other == 1 && (
              <ErrorStatement
                text={"Please enter the category for your post."}
              />
            )}
          </div>
        )}

        {/* Quill Editor */}
        <div className="mt-10">
          {error.content == 1 && (
            <ErrorStatement text={"Please add the content for your post."} />
          )}
          <ReactQuill
            theme="snow"
            className="h-96 mt-2"
            value={value}
            onChange={setValue}
          />
        </div>

        {/* Save Button */}
        <div className="mt-36 lg:mt-20 flex justify-center">
          <div className="w-[45%] lg:w-[30%]">
            <CTAButton
              disabledText={"Please wait..."}
              disabled={disabled}
              onClick={handleSave}
              text="Save"
            />
          </div>
        </div>
      </div>

      {/* Preview Post */}
      <div className="p-10 pb-20 m-5 lg:m-10 bg-white shadow-xl border-[1px] rounded-xl">
        {/* Title */}
        <h1 className="text-2xl lg:text-4xl text-center font-medium flex justify-center gap-x-2 items-center">
          Preview your Journal post! <FaArrowDown />
        </h1>
        <hr className="border-[1px] my-5" />
        {/* Thumbnail Image */}
        {imageFile && (
          <div className="">
            <img
              src={URL.createObjectURL(imageFile)}
              className="max-h-96 w-full rounded object-contain object-center"
            ></img>
          </div>
        )}
        {/* Post Title */}{" "}
        <h1 className="mt-20 text-4xl lg:text-6xl font-bold text-ink">
          {title}
        </h1>
        {/* Post Content */}
        <div className="mt-10">
          <ReactQuill
            value={value}
            className="border-none postdisplay"
            theme="snow"
            readOnly
            modules={{ toolbar: null }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
