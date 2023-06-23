import React, { useEffect, useState } from "react";
import Tweet from "@/components/Tweet";
import { useSelector } from "react-redux";
import APIGET from "@/api/GET/APIGET";

interface TweetData {
  userId: string;
  tweetId: string;
  list: string;
}

const TweetList = (props: any) => {
  const { list } = props;
  const [tweetDataList, setTweetDataList] = useState<TweetData[]>([]);
  const token = useSelector((state: any) => state.auth.token);
  const fetchTweetList = () => {
    APIGET(
      `/${list}`,
      token,
      function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetDataList(data);
        }
      }
    );
  };

  useEffect(() => {
    fetchTweetList();
  }, []);

  return (
    <div>
      {tweetDataList.map((tweetData, index) => (
        <Tweet
          key={index}
          userId={tweetData.userId}
          tweetId={tweetData.tweetId}
        />
      ))}
    </div>
  );
};

export default TweetList;
