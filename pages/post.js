import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
const post = () => {
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  const submitPost = async (e) => {
    e.preventDefault();

    //check
    if (!post.description) {
      toast.error("Description cannot be empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      return;
    } else if (post.description.length > 300) {
      toast.error("Description cannot be over 300 characters", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      return;
    }
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" });
      toast.success("Post Has Been Made", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      return route.push("/");
    }
  };

  const checkUser = async () => {
    if (loading) return;
    if (!user) return route.push("/");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };
  //check user status
  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Edit Your Post" : "Create Your Post"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-700 h-48 w-full text-white rounded-md p-2 text-sm"
          ></textarea>
          <p className={`${post.description.length > 300 && "text-red-500"}`}>
            {post.description.length}/300
          </p>
        </div>
        <button
          onClick={submitPost}
          type="submit"
          className="w-full bg-cyan-500 text-white p-2 my-2 rounded-md text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default post;
