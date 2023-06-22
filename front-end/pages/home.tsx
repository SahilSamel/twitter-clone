import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '@/layouts/mainLayout';
import { useRouter } from "next/router";


const Home = () => {
  const tokenFromState = useSelector((state:any) => state.auth.token);
  const router = useRouter();

    // Check if user is logged in
    if (!tokenFromState) {
      router.push("/auth");
      return;
    }

  return (
    <Layout />
  );
};

export default Home;
