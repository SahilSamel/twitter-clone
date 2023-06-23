import React from 'react';
import Layout from '@/layouts/mainLayout';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';

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
    <Layout {...layoutProps}/>
  );
};

export default Home;
