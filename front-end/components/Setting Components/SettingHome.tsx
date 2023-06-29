import { CgProfile } from "react-icons/cg";
import { AiOutlineRight } from "react-icons/ai";
import { HiOutlineKey } from "react-icons/hi";
import { BsFillHeartbreakFill } from "react-icons/bs";
import SettingsHeader from "./SettingsHeader";
import { useRouter } from "next/router";

const Settings = () => {
  const route = useRouter();
  return (
    <div className="">
      <SettingsHeader
        title="Your Account"
        subtitle="See information about your account, download an archive of your data, or learn about your account deactivation options"
      />
      <ol className="">
        <li className="flex items-center hover:cursor-pointer hover:bg-slate-900 px-5 py-3" onClick={()=>{route.push('/settings/profile')}}>
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
            <h3 className="text-xs text-gray-500">Edit your password</h3>
          </div>
          <div className="flex-grow"></div>
          <AiOutlineRight className="text-2xl text-gray-500" />
        </li>
        <li className="flex items-center hover:cursor-pointer hover:bg-slate-900 px-5 py-3">
          <BsFillHeartbreakFill className="text-3xl mr-10 text-gray-500" />
          <div>
            <h2 className="text-base">Delete Account</h2>
            <h3 className="text-xs text-gray-500">
              Edit your profile information
            </h3>
          </div>
          <div className="flex-grow"></div>
          <AiOutlineRight className="text-2xl text-gray-500" />
        </li>
      </ol>
    </div>
  );
};

export default Settings;
