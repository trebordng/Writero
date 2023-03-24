import Message from "../../components/Message";
import { useRouter } from "next/router";
import { auth, db } from "../../utils/firebase";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
const Details = () => {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [hasChange, setHasChange] = useState(false);

  const submitMessage = async () => {
    if (!auth.currentUser) return router.push("/auth/login");
    if (!message) {
      toast.error("Please put in a message", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setHasChange(!hasChange);
    setMessage("");
  };

  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };
  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);
  return (
    <div>
      <Message {...routeData}>
        <div className="my-4">
          <div className="flex">
            <input
              className="text-white bg-gray-800 w-full p-2 text-sm"
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              value={message}
              placeholder="Send a Comment"
            />
            <button
              onClick={submitMessage}
              className="bg-cyan-500 text-white py-2 px-4 text-sm"
            >
              Submit
            </button>
          </div>
          <div className="py-6">
            <h2 className="font-bold">Comments</h2>
            {allMessages?.map((message, index) => {
              return (
                <div className="bg-white p-4 my-4 border-2" key={index}>
                  <div className="flex items-center gap-2 pb-4">
                    <img
                      className="w-10 rounded-full"
                      src={message.avatar}
                      alt=""
                    />
                    <h2>{message.username}</h2>
                  </div>
                  <h2>{message.message}</h2>
                </div>
              );
            })}
          </div>
        </div>
      </Message>
    </div>
  );
};

export default Details;
