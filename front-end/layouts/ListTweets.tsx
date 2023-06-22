import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tweet from '@/components/Tweet';
import getTweetList from '@/api/GET/getTweetList'

interface TweetData {
  userId: string;
  tweetId: string;
  list: string;
}

const TweetList = ({userId, list}:TweetData) => {
  const [tweetDataList, setTweetDataList] = useState<TweetData[]>([]);

  useEffect(() => {
    const fetchTweetList = () => {
      getTweetList(
        `/${list}?userId=${userId}`,
        null,
        function (err: any, data: any) {
          if (err) {
            console.log(err, "error at axios");
          } else {
            setTweetDataList(data);
          }
        }
      );
    };

    fetchTweetList();
  }, []);

  return (
    <div>
      {tweetDataList.map((tweetData, index) => (
        <Tweet key={index} userId={tweetData.userId} tweetId={tweetData.tweetId} />
      ))}
    </div>
  );
};

export default TweetList;
