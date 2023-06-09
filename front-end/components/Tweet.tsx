import React, { useEffect, useRef, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { FiShare } from "react-icons/fi";
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { LuEdit3 } from "react-icons/lu";
import GET from "@/api/GET/GET";
import { useSelector } from "react-redux";
import POST from "@/api/POST/POST";
import { useRouter } from "next/router";
import {serverUrl} from "@/constants/appConstant"

interface TweetData {
  text: string;
  userHandle: string;
  userName: string;
  mediaURL?: string;
  likes: number;
  bookmarks: number;
  replies: number;
  likedBy: boolean;
  bookmarkedBy: boolean;
  derivedUserId?: string;
  derivedTweetId?: string;
  type: number;
  threadId: string;
  timestamp: string;
}

interface TweetProps {
  userId: string;
  tweetId: string;
  originalTweet?: boolean;
}

const Tweet: React.FC<TweetProps> = ({
  userId,
  tweetId,
  originalTweet = false,
}: TweetProps) => {
  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const currentUser = useSelector((state: any) => state.auth.userId);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchTweetData = () => {
    GET(
      `/compose/getTweet?userId=${currentUser}&tweetUserId=${userId}&tweetId=${tweetId}`,
      function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetData({
            ...data,
          });
        }
      }
    );
  };

  const updateTweetData = (action: string) => {
    const jsonData = { tweetUserId: userId, tweetId: tweetId };
    POST(`/compose/${action}`, jsonData, function (err: any, data: any) {
      if (err) {
        console.log(err, "error at axios");
      } else {
        setTweetData((prevData) => {
          if (prevData) {
            let updatedLikedBy = prevData.likedBy;
            let updatedBookmarkedBy = prevData.bookmarkedBy;

            if (action === "like" || action === "dislike") {
              updatedLikedBy = !prevData.likedBy;
            } else if (action === "bookmark" || action === "unbookmark") {
              updatedBookmarkedBy = !prevData.bookmarkedBy;
            }

            return {
              ...prevData,
              likedBy: updatedLikedBy,
              bookmarkedBy: updatedBookmarkedBy,
            };
          }
          return null;
        });
      }
    });
  };

  const handleShare = (userHandle:string, tweetId:string) => {
    const url = `${serverUrl}/tweet/${userHandle}/${tweetId}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        console.log("URL copied to clipboard:", url);
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard:", error);
      });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      actionsRef.current &&
      !actionsRef.current.contains(event.target as Node)
    ) {
      setShowActions(false);
    }
  };

  useEffect(() => {
    fetchTweetData();
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userId, tweetId]);

  if (!tweetData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
        }}
      >
        <img
          src="https://firebasestorage.googleapis.com/v0/b/twitter-clone-ratio.appspot.com/o/Dual%20Ring-1s-200px.png?alt=media&token=f8ee5d3a-3601-446a-bfb1-c0dcc1762b9c"
          alt="Loading"
          style={{ maxHeight: "40px", maxWidth: "40px" }}
        />
      </div>
    );
  }

  const {
    type,
    text,
    mediaURL,
    derivedUserId,
    derivedTweetId,
    threadId,
    timestamp,
    likes,
    bookmarks,
    replies,
    userHandle,
    likedBy,
    bookmarkedBy,
    userName,
  } = tweetData;

  const formattedTimestamp = new Date(timestamp).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {derivedUserId && derivedTweetId && (
        <Tweet
          key={0}
          userId={derivedUserId}
          tweetId={derivedTweetId}
          originalTweet // Pass originalTweet prop to derived tweets
        />
      )}
      <div
        className={`flex shrink-0 border border-b-0 border-l-0 border-r-0 border-slate-700 ${
          derivedUserId ? "border-t-0" : ""
        } text-neutral-500`}
      >
        <div className="ml-4 mt-3 basis-1/12">
          <img
            className="border border-0 rounded-full min-w-[40px] min-h-[40px]"
            src="https://pbs.twimg.com/profile_images/1670639644378005508/Flv2gLEd_400x400.jpg"
            height={40}
            width={40}
            alt="Profile Avatar"
          />

          {originalTweet && (
            <div className="h-full" style={{ height: "calc(100% - 40px)" }}>
              <div className="relative bg-slate-800 h-full w-0.5 left-1/2 top-2"></div>
            </div>
          )}
        </div>
        <div className="ml-5 mt-3 mr-5 max-w-lg basis-11/12">
          <div className="mb-2">
            <span style={{ color: "white" }}>{userName}</span>{" "}
            <button
              onClick={() => router.push(`/profile/${userHandle}`)}
              className="text-slate-500 hover:underline cursor-pointer"
            >
              @{userHandle}
            </button>
          </div>
          <div className="text-neutral-50 mb-2">{text}</div>
          {mediaURL && (
            <div className="mb-3 tweet-media-responsive">
              <img
                className="border border-0 rounded-2xl max-w-full img-responsive"
                src={mediaURL}
                alt="Tweet Media"
              />
            </div>
          )}
          <div className="pb-2 text-slate-400 text-sm">
            {formattedTimestamp}
          </div>
          <div className=" pb-3 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                className="flex items-center text-lg"
                onClick={() => router.push(`/tweet/${userHandle}/${tweetId}`)}
              >
                <BiMessageRounded className="mr-1" />
              </button>
              <div className="text-sm">{replies}</div>
            </div>
            <button
              className="flex items-center text-lg"
              data-tip="Retweet and Quote"
              onClick={() => setShowActions(!showActions)}
            >
              <FaRetweet className="mr-1" />
            </button>

            {showActions && (
              <div className="relative">
                <div
                  ref={actionsRef}
                  className="absolute bg-black text-neutral-500 shadow rounded-md p-2 ring ring-slate-800 ring-offset-1 ring-offset-slate-1 dark:ring-offset-slate-700"
                  style={{
                    top: "100%",
                    left: "-20px",
                    zIndex: 1000,
                  }}
                >
                  <button className=" drop-shadow-white flex items-center text-sm mb-2">
                    <FaRetweet className="mr-1" />
                    Retweet
                  </button>
                  <button className=" drop-shadow-white flex items-center text-sm">
                    <LuEdit3 className="mr-1" />
                    Quote
                  </button>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                className="flex items-center text-lg"
                onClick={() => updateTweetData(likedBy ? "dislike" : "like")}
              >
                {likedBy ? (
                  <AiFillHeart className="text-red-500" />
                ) : (
                  <AiOutlineHeart />
                )}
              </button>
              <div className="text-sm">{likes}</div>
            </div>

            <div className="flex space-x-2">
              <button
                className="flex items-center text-sm"
                onClick={() =>
                  updateTweetData(bookmarkedBy ? "unbookmark" : "bookmark")
                }
              >
                {bookmarkedBy ? (
                  <BsFillBookmarkFill className="mr-1 text-blue-500" />
                ) : (
                  <BsBookmark className="mr-1" />
                )}
              </button>
              <div className="text-sm">{bookmarks}</div>
            </div>

            <button className="flex items-center text-base" onClick={() => handleShare(userHandle, tweetId)}>
              <FiShare className="mr-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
