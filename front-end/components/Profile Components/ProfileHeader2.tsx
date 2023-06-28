import Image from "next/image";
import { MdCalendarMonth } from "react-icons/md";
import ProfileImage from "../ProfileImage";

interface ProfileHeader2Props {
  userName: string;
  userHandle: string;
  joinDate: string;
  following: number;
  followers: number;
  location: string;
  bio: string;
}

const ProfileHeader2: React.FC<ProfileHeader2Props> = ({
  userName,
  userHandle,
  joinDate,
  following,
  followers,
  location,
  bio,
}) => {
  return (
    <div>
      <Image
        src="https://pbs.twimg.com/profile_banners/3794171893/1687502503/1500x500"
        width={1500}
        height={500}
        alt="Picture of the author"
      />
      <div className="relative bottom-16 left-5">
        <ProfileImage
          width={135}
          height={135}
          className="absolute rounded-full border-solid border-4 border-black"
        />
      </div>
      <div className="flex justify-end p-3 ">
        <div className=" font-bold	border border-solid p-1.5 px-5 border-slate-400 rounded-e-3xl	rounded-l-3xl select-none hover:cursor-pointer  hover:bg-slate-900		">
          Edit Profile
        </div>
      </div>

      <div className="p-4">
        <div className=" font-bold text-xl	">{userName}</div>
        <div className="text-gray-500 text-base pb-4		">{`@${userHandle}`}</div>

        <div className="text-gray-500 text-base flex items-center pb-2">
          <MdCalendarMonth />
          <div>{`Joined ${joinDate}`}</div>
        </div>

        <div className="flex ">
          <div className="text-gray-500 pr-6 hover:underline decoration-solid cursor-pointer">
            <span className="text-white font-bold">{following}</span> Following
          </div>
          <div className="text-gray-500 hover:underline decoration-solid cursor-pointer">
            <span className="text-white	font-bold	">{followers}</span> Followers
          </div>
        </div>

        <div className="text-gray-500 text-base pt-2">{location}</div>
        <div className="text-gray-500 text-base pt-2">{bio}</div>
      </div>
    </div>
  );
};

export default ProfileHeader2;
