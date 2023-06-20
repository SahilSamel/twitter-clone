import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tweet from '@/components/Tweet';

interface TweetData {
  userId: string;
  tweetId: string;
}

const TweetList: React.FC = () => {
  const [tweetDataList, setTweetDataList] = useState<TweetData[]>([]);

  useEffect(() => {
    const fetchTweetList = async () => {
      try {
        const response = await axios.get<TweetData[]>('/refreshcache');
        setTweetDataList(response.data);
      } catch (error) {
        console.log(error);
      }
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
