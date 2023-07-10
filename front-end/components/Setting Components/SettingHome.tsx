import { CgProfile } from "react-icons/cg";
import { AiOutlineRight } from "react-icons/ai";
import { HiOutlineKey } from "react-icons/hi";
import { BsFillHeartbreakFill } from "react-icons/bs";
import SettingsHeader from "./SettingsHeader";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import POST from "@/api/POST/POST";
import { clearUserId, clearUserHandle } from "@/state/authStates";

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleToggleDeleteAccount = () => {
    setShowDeleteAccount(!showDeleteAccount);
  };


  const handleDeleteAccount: SubmitHandler<Record<string, any>> = async (
    formData
  ) => {
    const jsonData = JSON.stringify(formData);
    POST("/profile/deleteAccount", jsonData, function (err: any, data: any) {
      if (err) {
        setErrorMessage("Invalid Password");
      } else {
        const { uid, userHandle } = data;
        dispatch(clearUserId(uid));
        dispatch(clearUserHandle(userHandle));
        router.push("/");
      }
    });
    console.log("Pressed the button");
  };

  return (
    <div className="">
      <SettingsHeader
        title="Your Account"
        subtitle="See information about your account, download an archive of your data, or learn about your account deactivation options"
      />
      <ol className="">
        <li
          className="flex items-center hover:cursor-pointer hover:bg-slate-900 px-5 py-3"
          onClick={() => {
            router.push("/settings/profile");
          }}
        >
          <CgProfile className="text-3xl mr-10 text-gray-500" />
          <div>
            <h2 className="text-base">Profile Information</h2>
            <h3 className="text-xs text-gray-500">
              Edit your profile information
            </h3>
          </div>
          <div className="flex-grow"></div>
          <AiOutlineRight className="text-2xl text-gray-500" />
        </li>

        <li className="flex items-center hover:cursor-pointer hover:bg-slate-900 px-5 py-3">
          <HiOutlineKey className="text-3xl mr-10 text-gray-500" />
          <div>
            <h2 className="text-base">Change Password</h2>
            <h3 className="text-xs text-gray-500">Change your password</h3>
          </div>
          <div className="flex-grow"></div>
          <AiOutlineRight className="text-2xl text-gray-500" />
        </li>
        <li
          className="flex items-center hover:cursor-pointer hover:bg-slate-900 px-5 py-3"
          onClick={handleToggleDeleteAccount}
        >
          <BsFillHeartbreakFill className="text-3xl mr-10 text-gray-500" />
          <div>
            <h2 className="text-base">Delete Account</h2>
            <h3 className="text-xs text-gray-500">Delete your account</h3>
          </div>
          <div className="flex-grow"></div>
          <AiOutlineRight className="text-2xl text-gray-500" />
        </li>
        {showDeleteAccount && (
          <div className="fixed inset-0 flex justify-center items-center z-1 h-screen w-screen backdrop-filter backdrop-blur-sm">
            <form onSubmit={handleSubmit(handleDeleteAccount)}>
              <div className="absolute top-1/2 left-1/2 inset-0 bg-black p-6 rounded-lg drop-shadow-standard h-min w-min">
                <h2 className="text-lg font-semibold mb-4">Delete Account</h2>
                <p>Please enter your password to delete your account:</p>
                <input
                  type="password"
                  {...register("password")}
                  className="border border-gray-300 rounded-lg px-4 py-2 mt-2 mb-4"
                />
                {errors.password && (
                  <p className="text-red-500">Password is required</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleToggleDeleteAccount}
                    className="text-gray-500 mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </ol>
    </div>
  );
};

export default Settings;
