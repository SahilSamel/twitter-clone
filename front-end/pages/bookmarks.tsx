import React from 'react';
import Layout from '@/layouts/mainLayout';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import TweetList from '@/layouts/ListTweets';

const Bookmarks = () => {
  return (
    <Layout middleComponent={TweetList} list="getBookmarks"/>
  );
};

export default Bookmarks;
