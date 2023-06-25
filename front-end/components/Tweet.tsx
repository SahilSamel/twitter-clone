import React, { useEffect, useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineRetweet,
  AiOutlineMessage,
  AiOutlineShake,
} from "react-icons/ai";
import axios from "axios";
import APIGET from "@/api/GET/APIGET";
import { useSelector } from "react-redux";
interface TweetData {
  text: string;
  userhandle: string;
  mediaURL?: string;
}

interface TweetProps {
  userId: string;
  tweetId: string;
}

const Tweet: React.FC<TweetProps> = ({ userId, tweetId }: TweetProps) => {
  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const token = useSelector((state: any) => state.auth.token);
  const fetchTweetData = () => {
    APIGET(
      `/getTweet?userId=${userId}&tweetId=${tweetId}`,
      token,
      function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetData(data);
        }
      }
    );
  };

  useEffect(() => {
    fetchTweetData();
  }, [userId, tweetId]);

  if (!tweetData) {
    return <div>Loading...</div>;
  }

  const { text, userhandle, mediaURL } = tweetData;

  return (
    <div className="border p-4 mb-4">
      <div className="text-gray-600 mb-2">@{userhandle}</div>
      <div className="text-gray-800 mb-2">{text}</div>
      {mediaURL && <img src={mediaURL} alt="Tweet Media" className="mb-2" />}

      <div className="flex items-center text-gray-600">
        <button className="flex items-center mr-4">
          <AiOutlineHeart className="mr-1" />
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
