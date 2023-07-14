import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserHandle, clearUserId } from "@/state/authStates";
import { useRouter } from "next/router";
import GET from "@/api/GET/GET";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineBell,
  AiOutlineBook,
  AiOutlineForm,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";


const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userHandle = useSelector((state: any) => state.auth.userHandle);
  const handleProfileClick = () => {
    router.push(`/profile/${userHandle}`);
  };
  const handleLogout = () => {
    GET("/auth/clearAuth", function (err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        dispatch(clearUserId());
        dispatch(clearUserHandle());
        router.push("/");
      }
    });
  };

  return (
    <div className="flex flex-col gap-5 justify-start items-start max-w-max px-2 text-2xl text-regular mobile:fixed mobile:flex-row mobile:bottom-0 mobile:left-0 mobile:right-0">
      <div className="py-2 px-4 mobile:hidden">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/twitter-clone-ratio.appspot.com/o/icons8-twitter-an-american-online-news-and-social-networking-service-24.png?alt=media&token=e94558c2-116d-4cf6-bba4-224ece1a22e0"
          alt="twitter logo white"
        />
      </div>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg mobile:text-2xl mobile:text-xl hover:bg-blue-100 hover:text-blue-500`}
        onClick={() => {
          router.push("/home");
        }}
      >
        <AiOutlineHome />
        <div className="mobile:hidden tablet:hidden">
          <span>Home</span>
        </div>
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg mobile:text-2xl mobile:text-xl hover:bg-blue-100 hover:text-blue-500`}
        onClick={handleProfileClick}
      >
        <AiOutlineUser />
        <div className="mobile:hidden tablet:hidden">
          <span>Profile</span>
        </div>
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg mobile:hidden hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineBell />
        <div className="mobile:hidden tablet:hidden">
          <span>Notifications</span>
        </div>
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg mobile:text-2xl mobile:text-xl hover:bg-blue-100 hover:text-blue-500`}
        onClick={() => {
          router.push("/bookmarks");
        }}
      >
        <AiOutlineBook />
        <div className="mobile:hidden tablet:hidden">
          <span>Bookmarks</span>
        </div>
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg mobile:hidden hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineForm />
        <div className="mobile:hidden tablet:hidden">
          <span>Tweet</span>
        </div>
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg mobile:text-2xl mobile:text-xl hover:bg-blue-100 hover:text-blue-500`}
        onClick={() => {
          router.push("/settings");
        }}
      >
        <AiOutlineSetting />
        <div className="mobile:hidden tablet:hidden">
          <span>Settings</span>
        </div>
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg mobile:hidden hover:bg-blue-100 hover:text-blue-500`}
        onClick={handleLogout}
      >
        <AiOutlineLogout />
        <div className="mobile:hidden tablet:hidden">
          <span>Logout</span>
        </div>
      </button>
    </div>
  );
};

export default Sidebar;
