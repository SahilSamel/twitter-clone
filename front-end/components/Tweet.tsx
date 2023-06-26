import React, { useEffect, useState } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineRetweet,
  AiOutlineMessage,
  AiOutlineShake,
} from "react-icons/ai";
import APIGET from "@/api/GET/APIGET";
import { useSelector } from "react-redux";
import APIPOST from "@/api/POST/APIPOST";

interface TweetData {
  text: string;
  userhandle: string;
  mediaURL?: string;
  liked: boolean; // New field for storing like status
}

interface TweetProps {
  userId: string;
  tweetId: string;
}

const Tweet: React.FC<TweetProps> = ({ userId, tweetId }: TweetProps) => {
  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const token = useSelector((state: any) => state.auth.token);

  const fetchTweetData = () => {
    APIGET(`/compose/getTweet?userId=${userId}&tweetId=${tweetId}`, token, function (err: any, data: any) {
      if (err) {
        console.log(err, "error at axios");
      } else {
        setTweetData({ ...data, liked: data.action === "like" }); // Set liked field based on action
      }
    });
  };

  const updateTweetData = (action: string) => {
    const jsonData = { tweetUserId: userId, tweetId: tweetId };
    APIPOST(`/compose/${action}`, token, jsonData, function (err: any, data: any) {
      if (err) {
        console.log(err, "error at axios");
      } else {
        setTweetData((prevData) => {
          if (prevData) {
            return { ...prevData, liked: action === "like" };
          }
          return null;
        });
        
      }
    });
  };

  useEffect(() => {
    fetchTweetData();
  }, [userId, tweetId]);

  if (!tweetData) {
    return <div>Loading...</div>;
  }

  const { text, userhandle, mediaURL, liked } = tweetData; // Extract liked from tweetData

  return (
    <div className="border p-4 mb-4">
      <div className="text-gray-600 mb-2">@{userhandle}</div>
      <div className="text-gray-800 mb-2">{text}</div>
      {mediaURL && <img src={mediaURL} alt="Tweet Media" className="mb-2" />}

      <div className="flex items-center text-gray-600">
        <button
          className="flex items-center mr-4"
          onClick={() => updateTweetData(liked ? "dislike" : "like")} // Use liked state for action
        >
          {liked ? <AiFillHeart className="mr-1 text-red-500" /> : <AiOutlineHeart className="mr-1" />}
          Likes
        </button>
        <button className="flex items-center mr-4">
          <AiOutlineRetweet className="mr-1" />
          Retweet
        </button>
        <button className="flex items-center mr-4">
          <AiOutlineMessage className="mr-1" />
          Quote
        </button>
        <button className="flex items-center">
          <AiOutlineShake className="mr-1" />
          Replies
        </button>
      </div>
    </div>
  );
};

export default Tweet;