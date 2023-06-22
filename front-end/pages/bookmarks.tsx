import React from 'react';
import Layout from '@/layouts/mainLayout';

const Bookmarks = () => {
  const layoutProps = {
    list: "getBookmarks"
  };
  return (
    <Layout {...layoutProps}/>
  );
};

export default Bookmarks;
