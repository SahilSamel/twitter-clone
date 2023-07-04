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
import { useWindowSize } from "@/utils/Windowsize"; // Custom hook for getting window size

const Sidebar = () => {
  const { width } = useWindowSize(); // Get window width using custom hook
  const isMobile = width <= 1222; // Define breakpoint for mobile screens
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
    <div className="fixed flex flex-col gap-5 justify-start items-start max-w-xs ">
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? "text-3xl" : "text-2xl"
        } hover:bg-blue-100 hover:text-blue-500`}
        onClick={() => {
          router.push("/home");
        }}
      >
        <AiOutlineHome />
        {!isMobile && <span>Home</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? "text-3xl" : "text-2xl"
        } hover:bg-blue-100 hover:text-blue-500`}
        onClick={handleProfileClick}
      >
        <AiOutlineUser />
        {!isMobile && <span>Profile</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? "text-3xl" : "text-2xl"
        } hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineBell />
        {!isMobile && <span>Notifications</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? "text-3xl" : "text-2xl"
        } hover:bg-blue-100 hover:text-blue-500`}
        onClick={() => {
          router.push("/bookmarks");
        }}
      >
        <AiOutlineBook />
        {!isMobile && <span>Bookmark</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? "text-3xl" : "text-2xl"
        } hover:bg-blue-100 hover:text-blue-500`}
      >
        <AiOutlineForm />
        {!isMobile && <span>Tweet</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? "text-3xl" : "text-2xl"
        } hover:bg-blue-100 hover:text-blue-500`}
        onClick={() => {
          router.push("/settings");
        }}
      >
        <AiOutlineSetting />
        {!isMobile && <span>Settings</span>}
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isMobile ? "text-3xl" : "text-2xl"
        } hover:bg-blue-100 hover:text-blue-500`}
        onClick={handleLogout}
      >
        <AiOutlineLogout />
        {!isMobile && <span>Account (Logout)</span>}
      </button>
    </div>
  );
};

export default Sidebar;
