import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import GET from "@/api/GET/GET";

const Rightbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useSelector((state: any) => state.auth.userId);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    GET(
      `/profile/getRecommendations?userId=${userId}`,
      (err: any, data: any) => {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setRecommendations(data);
        }
      }
    );
  }, []);

  return (
    <>
      <div style={{ maxHeight: "100vh", overflowY: "auto" }}>
        <div className="bg-slate-900 rounded-xl">
          <div>Who to Follow</div>
          {recommendations.map((user) => (
            <div key={user.uid} className="flex items-center p-4">
              <img
                src={user.profileImageURL}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <div className="text-white font-semibold">{user.userName}</div>
                <div className="text-gray-500">
                  <button
                    onClick={() => router.push(`/profile/${user.userHandle}`)}
                    className="text-slate-500 hover:underline cursor-pointer"
                  >
                    @{user.userHandle}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Rightbar;
