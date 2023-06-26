import React from 'react';
import Layout from '@/layouts/mainLayout';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import TweetList from '@/layouts/ListTweetsLayout';

const Bookmarks = () => {
  const token = useSelector((state:any) => state.auth.token);
  const router = useRouter();
  if(!token){
    router.push("/auth");
    return;
  }
  return (
    <Layout middleComponent={TweetList} list="getBookmarks"/>
  );
};

export default Bookmarks;
