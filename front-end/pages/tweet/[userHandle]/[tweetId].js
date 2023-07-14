import Layout from "@/layouts/mainLayout";
import React, { useEffect, useState } from "react";
import TweetList from "@/layouts/ListTweetsLayout";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import GET from "@/api/GET/GET";
import POST from "@/api/POST/POST";
import Tweet from "@/components/Tweet";
import CreateTweet from "@/components/CreateTweet";

const TweetPage = () => {
  const [userId, setuserId] = useState('');
  const [tweetData, setTweetData] = useState(null);
  const currentUser = useSelector((state) => state.auth.userId);
  const router = useRouter();

  const fetchUserId = () => {
    const data = {
      userHandle: router.query.userHandle,
    };
    POST("/profile/getUserID", data, function (err, data) {
      if (err) {
        console.log(err, "error at axios");
      } else {
        setuserId(data.userId);
      }
    });
  };

  const fetchTweetData = () => {
    if (router.query.tweetId === undefined) {
      return;
    }
    GET(
      `/compose/getTweet?userId=${currentUser}&tweetUserId=${userId}&tweetId=${router.query.tweetId}`,
      function (err, data) {
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

  useEffect(() => {
    fetchUserId();
  }, [router.query.userHandle]);

  useEffect(() => {
    fetchTweetData();
  }, [userId]);

  if (!tweetData) {
    return null; // Add loading indicator or placeholder here
  }

  return (
    <>
      <Tweet
        key={0}
        userId={userId}
        tweetId={router.query.tweetId.toString()}
      />
      <CreateTweet type="1" derivedUserId={userId} derivedTweetId={router.query.tweetId}/>
      <TweetList list="getReplies" threadId={tweetData.threadId} />
    </>
  );
};

const DisplayTweet = () => {
  return <Layout middleComponent={TweetPage} />;
};

export default DisplayTweet;
