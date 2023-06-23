import Image from "next/image";
import { MdCalendarMonth } from "react-icons/md";

const ProfileHeader2 = () => {
  return (
    <div>
      <Image
        src="https://pbs.twimg.com/profile_banners/3794171893/1687502503/1500x500"
        width={1500}
        height={500}
        alt="Picture of the author"
      />
      <div className="relative bottom-16 left-5">
        <Image
          src="https://pbs.twimg.com/profile_images/1369150025360494593/U6uUYd2l_400x400.jpg"
          width={135}
          height={135}
          alt="Picture of the author"
          className="absolute rounded-full border-solid border-4 border-black"
        />
      </div>
      <div className="flex justify-end p-3 ">
        <div className=" font-bold	border border-solid p-1.5 px-5 border-slate-400 rounded-e-3xl	rounded-l-3xl select-none hover:cursor-pointer  hover:bg-slate-900		">
          Edit Profile
        </div>
      </div>
      
      

      <div className="p-4">

        <div className=" font-bold text-xl	">UserName</div>
        <div className="text-gray-500 text-base pb-4		">@userhandle</div>


        <div className="text-gray-500 text-base flex items-center pb-2">
          <MdCalendarMonth/>
        <div >Joined June 2023</div>
        </div>

        <div className="flex ">
          <div className="text-gray-500 pr-6 hover:underline decoration-solid cursor-pointer" ><span className="text-white font-bold">25</span> Following</div>
          <div className="text-gray-500 hover:underline decoration-solid cursor-pointer"><span className="text-white	font-bold	">3345</span> Followers</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader2;
