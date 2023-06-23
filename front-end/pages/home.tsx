import React from 'react';
import Layout from '@/layouts/mainLayout';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import TweetList from '@/layouts/ListTweets';


const Home = () => {
  const token = useSelector((state:any) => state.auth.token);
  const router = useRouter();
  if(!token){
    router.push("/auth");
    return;
  }
  const layoutProps = {
    list: "getRefreshCache"
  };
  return (
    <Layout middleComponent={TweetList} list="getRefreshCache" />

  );
};

export default Home;
