import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";

//import firebase
import {
  getDownloadURL,
  getStorage,
  ref as storageReference,
  uploadBytes,
} from "firebase/storage";
import { set, push, ref as databaseRef } from "firebase/database";
import { storage, database } from "../DB/firebase";

export default function AddPost() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  const navigate = useNavigate();

  const POSTS_FOLDER_NAME = "communityPosts";
  const IMAGES_FOLDER_NAME = "images";

  const submitPost = (url) => {
    let timeStamp = new Date().toLocaleString();
    const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
    const newPostRef = push(postListRef);
    set(newPostRef, {
      date: timeStamp,
      title: inputMessage,
      file: fileInputFile,
      imageurl: url,
      likes: 0,
      author: user.displayName,
      comments: [{ text: "", user: "" }],
    });

    setFileInputFile(null);
    setFileInputValue("");

    console.log("New Post Added");
    navigate("/community");
  };

  const uploadImage = (e, file, user) => {
    e.preventDefault();
    const storageRef = storageReference(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
    );
    uploadBytes(storageRef, fileInputFile)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((url) => {
        console.log(url);
        return submitPost(url);
      });
  };

  const user = useContext(UserContext);
  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate("/login");
    }
  });

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => {
            setFileInputValue(e.target.files[0].name);
            setFileInputFile(e.target.files[0]);
          }}
        />
        <input
          type="submit"
          value="Add New Post"
          onClick={(e) => (fileInputFile ? uploadImage(e) : submitPost(""))}
        />
      </form>
    </div>
  );
}
