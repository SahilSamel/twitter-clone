import Image from "next/image";
import { MdCalendarMonth } from "react-icons/md";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import router from "next/router";
import POST from "@/api/POST/POST";

interface ProfileHeader2Props {
  userName: string;
  userHandle: string;
  joinDate: string;
  following: number;
  followers: number;
  location: string;
  bio: string;
  profileImageURL: string;
  bgImageURL: string;
}

const ProfileHeader2: React.FC<ProfileHeader2Props> = ({
  userName,
  userHandle,
  joinDate,
  following,
  followers,
  location,
  bio,
  profileImageURL,
  bgImageURL,
}) => {
  const currentUserId = useSelector((state: any) => state.auth.userId);
  const [userId, setuserId] = useState("");
  const [followed, setFollowed] = useState(false);

  const handleFollow = () => {
    const jsonData = JSON.stringify({
      followeeUserId: userId
    });
    if (followed) {
      POST(`/user/unfollow`, jsonData, function(err:any, data:any){
        if(err) {
          console.log(err);
        } else {
          setFollowed(!followed);
        }
      })
    } else {
      POST(`/user/follow`, jsonData, function(err:any, data:any){
        if(err) {
          console.log(err);
        } else {
          setFollowed(!followed);
        }
      })
    }
  };

  useEffect(() => {
    const fetchUserId = () => {
      if (router.query.userhandle == undefined) return;
      POST(
        `/profile/getUserID`,
        { userHandle: `${router.query.userhandle}` },
        function (err: any, data: any) {
          if (err) {
            console.log(err, "error at axios");
          } else {
            setuserId(data.userId);
            checkIfFollows();
          }
        }
      );
    };

    const checkIfFollows = () => {
      const jsonData = JSON.stringify({
        currentUserId: currentUserId,
        userId: userId,
      });
      POST(`/user/checkFollows`, jsonData, function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setFollowed(data);
        }
      });
    };

    fetchUserId();
    
  }, [userId]);

  return (
    <div>
      <div style={{ height: 200 }} className="relative">
        <Image
          src={
            bgImageURL == "" ? "/../public/assets/defaultBG.png" : bgImageURL
          }
          fill={true}
          alt="Picture of the author"
        />
      </div>
      <div className="relative bottom-16 left-5">
        <Image
          src={
            profileImageURL == ""
              ? "/../public/assets/defaultPFP.jpg"
              : profileImageURL
          }
          width={135}
          height={135}
          alt="Picture of the author"
          className="absolute rounded-full border-solid border-4 border-black"
        />
      </div>

      <div className="flex justify-end p-3 ">
        <div
          className="font-bold border border-solid p-1.5 px-5 border-slate-400 rounded-e-3xl rounded-l-3xl select-none hover:cursor-pointer hover:bg-slate-900"
          onClick={handleFollow}
        >
          {followed ? "Unfollow" : "Follow"}
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
