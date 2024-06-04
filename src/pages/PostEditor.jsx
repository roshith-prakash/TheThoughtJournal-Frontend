import { useState, useRef } from "react";
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

const PostEditor = () => {
  const { currentUser } = useAuth();
  const fileRef = useRef();
  const [value, setValue] = useState();
  const [disabled, setDisabled] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [title, setTitle] = useState();
  const [category, setCategory] = useState();
  const [error, setError] = useState({
    title: 0,
    category: 0,
    image: 0,
    content: 0,
  });

  const handleSave = () => {
    setError({
      title: 0,
      category: 0,
      image: 0,
      content: 0,
    });

    if (title == null || title == undefined || title.length <= 0) {
      setError((prev) => ({ ...prev, title: 1 }));
      return;
    } else if (imageFile == null || imageFile == undefined) {
      setError((prev) => ({ ...prev, image: 1 }));
      return;
    } else if (category == null || category == undefined) {
      setError((prev) => ({ ...prev, category: 1 }));
      return;
    } else if (isEditorEmpty(value)) {
      setError((prev) => ({ ...prev, content: 1 }));
      return;
    }

    console.log("OK");
    setDisabled(true);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", String(value));
    formData.append("user", JSON.stringify(currentUser));

    axiosInstance
      .post("/post/create-post", formData, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
      })
      .then((res) => {
        console.log(res.data);
        setDisabled(false);
      })
      .catch((err) => {
        console.log(err);
        setDisabled(false);
      });
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setImageFile(e.target.files[0]);
    fileRef.current.value = null;
  };

  return (
    <div className="bg-bgwhite">
      <Navbar />

      {/* Editor box */}
      <div className="p-10 pb-20 m-10 bg-white shadow-md rounded-xl">
        {/* Title */}
        <h1 className="text-2xl lg:text-4xl text-center font-medium">
          Create a new Journal post
        </h1>

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
            <div className="mt-3 flex gap-x-5 items-center">
              <div className="flex-1">
                {/* Bu  */}
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
        <div className="my-5">
          <Select
            onValueChange={(selectedCategory) => setCategory(selectedCategory)}
          >
            <SelectTrigger className="w-[180px]">
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
      <div className="p-10 pb-20 m-10 bg-white shadow-md rounded-xl">
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
        <h1 className="mt-20 text-3xl lg:text-4xl font-medium text-ink">
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

export default PostEditor;
