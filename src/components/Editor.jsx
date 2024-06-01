import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = () => {
  const [value, setValue] = useState("");
  return (
    <>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <br></br>
      <br />
      <ReactQuill value={value} readOnly={true} theme={"bubble"} />
    </>
  );
};

export default Editor;
