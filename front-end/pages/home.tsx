import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '@/layouts/mainLayout';

const Home = () => {
  const tokenFromState = useSelector((state:any) => state.auth.token);
  return (
    <Layout />
  );
};

export default Home;
