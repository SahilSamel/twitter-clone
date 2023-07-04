import React, { useEffect, useState, useRef } from "react";
import Tweet from "@/components/Tweet";
import { useSelector, useDispatch } from "react-redux";
import POST from "@/api/POST/POST";
import GET from "@/api/GET/GET";
import { setTimer } from "@/state/cacheStates";

interface TweetData {
  userId: string;
  tweetId: string;
  list: string;
}

const TweetList = (props: any) => {
  const {threadId} = props;
  const { list: initialList, userIdprop } = props;
  const currentUserId = useSelector((state: any) => state.auth.userId);
  var userId: string;

  if (userIdprop != undefined) userId = userIdprop;
  else userId = currentUserId;

  const [tweetDataList, setTweetDataList] = useState<TweetData[]>([]);

  const lastServedTimestamp = useSelector(
    (state: any) => state.timer.lastServedTimestamp
  );
  const dispatch = useDispatch();
  const [refreshCount, setRefreshCount] = useState(0);
  const [list, setList] = useState(initialList);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const fetchTweetList = () => {
    if (list === "refresh") {
      setList("scrolldown");
      const jsonData = { lastServedTimestamp };
      POST(`/user/${list}`, jsonData, function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetDataList(data.refreshCache);
        }
      });
    } else if (list === "scrolldown") {
      const jsonData = { lastServedTimestamp };
      POST(`/user/${list}`, jsonData, function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetDataList((prevTweetDataList) => [
            ...prevTweetDataList,
            ...data.scrollDownCache,
          ]);

          dispatch(setTimer(data.timer));
        }
      });
    } else if (list === "getBookmarks") {
      POST(`/user/${list}`, {}, function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetDataList(data.bookmarks);
        }
      });
    } else if (list === "getReplies"){
      GET(`/compose/${list}?threadId=${threadId}`, function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetDataList(data.replies);
        }
      });
    } else {
      GET(`/profile/${list}?userId=${userId}`, function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetDataList(data.displayTweets);
        }
      });
    }
  };

  const handleRefresh = () => {
    setRefreshCount((prevCount) => prevCount + 1);
    setList("refresh"); // Change list to "refresh" when the refresh button is clicked
  };

  // const handleScroll = () => {
  //   if (
  //     listContainerRef.current &&
  //     listContainerRef.current.scrollHeight -
  //       listContainerRef.current.scrollTop ===
  //       listContainerRef.current.clientHeight
  //   ) {
  //     fetchTweetList(); // Reached the bottom of the component, fetch more data
  //   }
  // };

  useEffect(() => {
    fetchTweetList();
  }, [refreshCount]);

  useEffect(() => {
    fetchTweetList();
  }, [userId]);

  // useEffect(() => {
  //   if (listContainerRef.current) {
  //     listContainerRef.current.addEventListener("scroll", handleScroll);
  //   }

  //   return () => {
  //     if (listContainerRef.current) {
  //       listContainerRef.current.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, []);

  return (
    <>
      {list === "refresh" || list === "scrolldown" ? (
        <button onClick={handleRefresh}>Refresh</button>
      ) : null}
      {tweetDataList === undefined || tweetDataList.length === 0 ? (
        <div className="flex justify-center items-center">
          <p>No tweets to display</p>
        </div>
      ) : (
        tweetDataList.map((tweetData, index) => (
          <Tweet
            key={index}
            userId={tweetData.userId}
            tweetId={tweetData.tweetId}
          />
        ))
      )}
    </>
    
  );
};

export default TweetList;
