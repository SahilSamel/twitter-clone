import React, { useEffect, useState } from 'react';
import Tweet from '@/components/Tweet';
import getTweetList from '@/api/GET/getTweetList'
import { useSelector } from 'react-redux';

interface TweetData {
  userId: string;
  tweetId: string;
  list: string;
}

const TweetList = (props:any) => {
  const { list } = props;
  const [tweetDataList, setTweetDataList] = useState<TweetData[]>([]);

  useEffect(() => {
    const fetchTweetList = () => {
      getTweetList(
        `/${list}`,
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
