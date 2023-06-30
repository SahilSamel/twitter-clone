import React, { useEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineRetweet,
  AiOutlineMessage,
  AiOutlineShake,
} from "react-icons/ai";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { FiShare } from "react-icons/fi";
import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { LuEdit3 } from "react-icons/lu";
import APIGET from "@/api/GET/APIGET";
import { useSelector } from "react-redux";
import APIPOST from "@/api/POST/APIPOST";

interface TweetData {
  text: string;
  userHandle: string;
  userName: string;
  mediaURL?: string;
  liked: boolean;
  bookmarked: boolean;
  likes: string[];
  derivedUserId?: string; // Added derivedUserId property
  derivedTweetId?: string; // Added derivedTweetId property
  type:number;
  threadId:string;
  timestamp:string;

}

interface TweetProps {
  userId: string;
  tweetId: string;
  originalTweet?: boolean; // Added originalTweet prop
}

const Tweet: React.FC<TweetProps> = ({
  userId,
  tweetId,
  originalTweet = false,
}: TweetProps) => {
  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const token = useSelector((state: any) => state.auth.token);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  const fetchTweetData = () => {
    APIGET(
      `/compose/getTweet?userId=${userId}&tweetId=${tweetId}`,
      token,
      function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetData({
            ...data,
            liked: data.action === "like",
            bookmarked: data.action === "bookmark",
          });
        }
      }
    );
  };

  const updateTweetData = (action: string) => {
    const jsonData = { tweetUserId: userId, tweetId: tweetId };
    APIPOST(
      `/compose/${action}`,
      token,
      jsonData,
      function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetData((prevData) => {
            if (prevData) {
              return {
                ...prevData,
                liked: action === "like",
                bookmarked: action === "bookmark",
              };
            }
            return null;
          });
        }
      }
    );
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
    return <div>Loading...</div>;
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
    userHandle,
    liked,
    bookmarked,
    userName,
  } = tweetData;

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
        className={`flex border border-b-0 border-l-0 border-r-0 border-slate-700 ${
          derivedUserId ? "border-t-0" : ""
        } text-neutral-500`}
      >
        <div className="pl-4 pt-3">
          <img
            className="border border-0 rounded-full"
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
        <div className="pl-5 pt-3 max-w-lg">
          <div className=" mb-2">@{userHandle}</div>
          <div className="text-neutral-50 mb-2">{text}</div>
          {mediaURL && (
            <div className="mb-3">
              <img
                className="border border-0 rounded-2xl"
                src={mediaURL}
                alt="Tweet Media"
              />
            </div>
          )}

          <div className=" pb-3 flex items-center  space-x-4">
            <button
              className="flex items-center text-lg"
              onClick={() => updateTweetData(liked ? "dislike" : "like")}
            >
              {liked ? (
                <AiFillHeart className=" text-red-500" />
              ) : (
                <AiOutlineHeart className="" />
              )}
            </button>
            <div className="text-sm">{likes.length}</div>
            <button
              className="flex items-center text-sm"
              onClick={() =>
                updateTweetData(bookmarked ? "unbookmark" : "bookmark")
              }
            >
              {bookmarked ? (
                <BsFillBookmarkFill className="mr-1 text-blue-500" />
              ) : (
                <BsBookmark className="mr-1" />
              )}
            </button>

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

            <button className="flex items-center text-lg">
              <BiMessageRounded className="mr-1" />
            </button>
            <button className="flex items-center text-base">
              <FiShare className="mr-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
