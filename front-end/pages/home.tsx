import React from 'react';
import Layout from '@/layouts/mainLayout';
import { useRouter } from "next/router";


const Home = () => {
  const layoutProps = {
    list: "getRefreshCache"
  };
  return (
    <Layout {...layoutProps}/>
  );
};

export default Home;
