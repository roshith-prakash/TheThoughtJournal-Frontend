import axios from "axios";
import { useState, useEffect } from "react";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

function App() {
  const [data, setData] = useState("");

  console.log(data);

  return (
    <>
      <FroalaEditorComponent
        tag="textarea"
        model={data}
        onModelChange={(e) => setData(e)}
      />

      <FroalaEditorView model={data} />
    </>
  );
}

export default App;
