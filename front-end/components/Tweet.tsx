import React, { useEffect, useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineRetweet,
  AiOutlineMessage,
  AiOutlineShake,
} from "react-icons/ai";
import axios from "axios";
import getTweet from "@/api/GET/getTweet";

interface TweetData {
  text: string;
  userhandle: string;
  mediaURL?: string;
}

interface TweetProps {
  userId: string;
  tweetId: string;
}

const Tweet: React.FC<TweetProps> = ({ userId, tweetId }) => {
  const [tweetData, setTweetData] = useState<TweetData | null>(null);

  useEffect(() => {
    const fetchTweetData = () => {
      console.log(userId,tweetId);
      getTweet(
        `/getTweet?userId=${userId}&tweetId=${tweetId}`,
        null,
        function (err: any, data: any) {
          if (err) {
            console.log(err, "error at axios");
          } else {
            console.log(data);
            setTweetData(data);
          }
        }
      );
    };

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
