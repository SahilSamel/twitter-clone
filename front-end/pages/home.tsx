import React from 'react';
import Layout from '@/layouts/mainLayout';

const Home = () => {
  const layoutProps = {
    list: "getRefreshCache"
  };
  return (
    <Layout {...layoutProps}/>
  );
};

export default Home;
