import React, { useEffect, useState, useRef } from "react";
import Tweet from "@/components/Tweet";
import { useSelector, useDispatch } from "react-redux";
import APIPOST from "@/api/POST/APIPOST";
import APIGET from "@/api/GET/APIGET";
import { setTimer } from "@/state/cacheStates";

interface TweetData {
  userId: string;
  tweetId: string;
  list: string;
}

const TweetList = (props: any) => {
  const { list: initialList } = props;
  const [tweetDataList, setTweetDataList] = useState<TweetData[]>([]);
  const token = useSelector((state: any) => state.auth.token);
  const lastServedTimestamp = useSelector(
    (state: any) => state.timer.lastServedTimestamp
  );
  const dispatch = useDispatch();
  const [refreshCount, setRefreshCount] = useState(0);
  const [list, setList] = useState(initialList);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const fetchTweetList = () => {
    if (list === "refresh") {
      setList("scrolldown"); // Change list to "scrolldown" for refreshing

      const jsonData = { lastServedTimestamp };
      APIPOST(`/user/${list}`, token, jsonData, function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetDataList(data.refreshCache);
        }
      });
    } else if (list === "scrolldown") {
      const jsonData = { lastServedTimestamp };
      APIPOST(`/user/${list}`, token, jsonData, function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetDataList((prevTweetDataList) => [
            ...prevTweetDataList,
            ...data.scrollDownCache,
          ]);
          dispatch(setTimer(data.timer)); // Update lastServedTimestamp
        }
      });
    } else {
      APIGET(`/user/${list}`, token, function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setTweetDataList(data);
        }
      });
    }
  };

  const handleRefresh = () => {
    setRefreshCount((prevCount) => prevCount + 1);
    setList("refresh"); // Change list to "refresh" when the refresh button is clicked
  };

  const handleScroll = () => {
    if (
      listContainerRef.current &&
      listContainerRef.current.scrollHeight -
        listContainerRef.current.scrollTop ===
        listContainerRef.current.clientHeight
    ) {
      fetchTweetList(); // Reached the bottom of the component, fetch more data
    }
  };

  useEffect(() => {
    fetchTweetList();
  }, [list, refreshCount]);

  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (listContainerRef.current) {
        listContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div ref={listContainerRef} style={{ overflowY: "scroll", height: "500px" }}>
      <button onClick={handleRefresh}>Refresh</button>
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
