import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const Nav = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium">Writero</button>
      </Link>
      <ul className="flex items-center gap-10">
        {user ? (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm">Post</button>
            </Link>
            <Link href="/dashboard">
              <img className="border-2 border-cyan-500 w-12 rounded-full cursor-pointer" src={user.photoURL}/>
            </Link>
          </div>
        ) : (
          <Link
            href={"/auth/login"}
            className="py-2 px-4 text-sm bg-cyan-50 text-black "
          >
            Join Now
          </Link>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
