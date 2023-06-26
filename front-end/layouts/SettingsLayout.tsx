import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "@/state/authStates";
import APIPOST from "@/api/POST/APIPOST";
import { useRouter } from "next/router";
import { AiOutlineSetting, AiOutlineDelete } from "react-icons/ai";

const SettingsLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);

  const handleEditProfile = () => {
    // Add your edit profile logic here
  };

  const handleDeleteAccount = () => {
    APIPOST(`/profile/deleteAccount`, token, {},  function (err: any, data: any) {
        if (err) {
            console.log(err, "error at axios");
        } else {
            dispatch(clearToken());
            router.push("/");
        }
    });
  };

  return (
    <div className="flex flex-col gap-5 justify-start items-start max-w-xs">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-2xl hover:bg-blue-100 hover:text-blue-500"
        onClick={handleEditProfile}
      >
        <AiOutlineSetting />
        <span>Edit Profile</span>
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-2xl hover:bg-blue-100 hover:text-blue-500"
        onClick={handleDeleteAccount}
      >
        <AiOutlineDelete />
        <span>Delete Account</span>
      </button>
    </div>
  );
};

export default SettingsLayout;
