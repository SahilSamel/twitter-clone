import Layout from "@/layouts/mainLayout";
import ProfileHeader from "@/components/Profile Components/ProfileHeader";
import ProfileHeader2 from "@/components/Profile Components/ProfileHeader2";
import ProfileLikes from "@/components/Profile Components/ProfileLikes";
import ProfileMedia from "@/components/Profile Components/ProfileMedia";
import ProfileReplies from "@/components/Profile Components/ProfileReplies";
import React, { useEffect, useState } from "react";
import TweetList from "@/layouts/ListTweetsLayout";
import router from "next/router";
import GET from "@/api/GET/GET";
interface userData{
  userName: string,
  userHandle: string,
  bio: string,
  location: string,
  joinDate: string,
  followersCount: number,
  followeesCount: number
}


const ProfilePage = () => {
  const [section, setSection] = useState(0);
  const [userData, setUserData] = useState<userData | null>(null);
  const fetchUserData = () => {
    GET(`/profile/getProfile?userHandle=${router.query.userhandle}`, function (err: any, data: any) {
      if (err) {
        console.log(err, "error at axios");
      } else {
        setUserData(data); 
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  let listProp = "";
  if (section === 0) {
    listProp = "getTweets";
  } else if (section === 1) {
    listProp = "getReplies";
  } else if (section === 2) {
    listProp = "getMedia";
  } else if (section === 3) {
    listProp = "getLiked";
  }

  return (
    <div>
      <div className="border border-slate-600	">
      {userData && <ProfileHeader userName={userData.userName} />}
        {userData && (
          <ProfileHeader2
            userName={userData.userName}
            userHandle={userData.userHandle}
            bio={userData.bio}
            location={userData.location}
            followers={userData.followersCount}
            following={userData.followeesCount}
            joinDate={userData.joinDate}
          />
        )}

        <div className="flex justify-around mt-5">
          <div
            onClick={() => {
              setSection(0);
            }}
            className="font-bold flex-1 hover:bg-slate-700 hover:cursor-pointer"
          >
            {section === 0 ? (
              <div className="flex justify-center items-center h-14 underline decoration-4 underline-offset-18 decoration-solid decoration-blue-700	">
                Tweets
              </div>
            ) : (
              <div className="flex justify-center items-center h-14 text-gray-500">
                Tweets
              </div>
            )}
          </div>
          <div
            onClick={() => {
              setSection(1);
            }}
            className="font-bold flex-1 hover:bg-slate-700 hover:cursor-pointer"
          >
            {section === 1 ? (
              <div className="flex justify-center items-center h-14 underline decoration-4 underline-offset-18 decoration-solid decoration-blue-700	">
                Replies
              </div>
            ) : (
              <div className="flex justify-center items-center h-14 text-gray-500">
                Replies
              </div>
            )}
          </div>
          <div
            onClick={() => {
              setSection(2);
            }}
            className="font-bold flex-1 hover:bg-slate-700 hover:cursor-pointer"
          >
            {section === 2 ? (
              <div className="flex justify-center items-center h-14 underline decoration-4 underline-offset-18 decoration-solid decoration-blue-700	">
                Media
              </div>
            ) : (
              <div className="flex justify-center items-center h-14 text-gray-500">
                Media
              </div>
            )}
          </div>
          <div
            onClick={() => {
              setSection(3);
            }}
            className="font-bold flex-1 hover:bg-slate-700 hover:cursor-pointer"
          >
            {section === 3 ? (
              <div className="flex justify-center items-center h-14 underline decoration-4 underline-offset-18 decoration-solid decoration-blue-700	">
                Likes
              </div>
            ) : (
              <div className="flex justify-center items-center h-14 text-gray-500">
                Likes
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border border-slate-600">
        {section === 0 && <TweetList list={listProp} />}
        {section === 1 && <TweetList list={listProp} />}
        {section === 2 && <TweetList list={listProp} />}
        {section === 3 && <TweetList list={listProp} />}
      </div>
    </div>
  );
};

const Profile = () => {
  return <Layout middleComponent={ProfilePage} />;
};

export default Profile;

