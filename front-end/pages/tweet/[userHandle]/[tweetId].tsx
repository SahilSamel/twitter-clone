import Layout from "@/layouts/mainLayout";
import React, { useEffect, useState } from "react";
import TweetList from "@/layouts/ListTweetsLayout";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import GET from "@/api/GET/GET";
import POST from "@/api/POST/POST";
import Tweet from "@/components/Tweet";

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

const TweetPage = () => {
  const [userId, setuserId] = useState("");
  const [tweetData, setTweetData] = useState<TweetData | null>(null);
  const currentUser = useSelector((state: any) => state.auth.userId);
  const router = useRouter();

  const fetchUserId = () => {
    console.log("Fetching User Id")
  
    const data = {
      userHandle: router.query.userhandle,
    };
  
    POST("/profile/getUserID", data, function (err: any, data: any) {
      if (err) {
        console.log(err, "error at axios");
      } else {
        console.log(data.userId);
        setuserId(data.userId);
        fetchTweetData();
      }
    });
  };
  

  const fetchTweetData = () => {
    if (router.query.tweetId === undefined) {
      return;
    }
    GET(
      `/compose/getTweet?userId=${currentUser}&tweetUserId=${userId}&tweetId=${router.query.tweetId}`,
      function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          console.log("fetched");
          setTweetData({
            ...data,
          });
        }
      }
    );
  };

  useEffect(() => {
    fetchUserId();
  }, [router.query.userHandle, router.query.tweetId, currentUser]);
  

  if (!tweetData) {
    return null; // Add loading indicator or placeholder here
  }

  return (
    <>
      <Tweet
        key={0}
        userId={userId}
        tweetId={router.query.tweetId?.toString()}
      />

      <TweetList list="getReplies" threadId={tweetData.threadId} />
    </>
  );
};

const DisplayTweet = () => {
  return <Layout middleComponent={TweetPage} />;
};

export default DisplayTweet;
