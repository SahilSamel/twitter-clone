import React from 'react';
import Sidebar from '@/components/Sidebar';
import ListTweets from '@/layouts/ListTweets';

const Layout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '0 0 auto' }}>
        <Sidebar />
      </div>
      <div style={{ flex: '0 1 60%' }}>
        <ListTweets />
      </div>
      <div style={{ flex: '0 0 auto' }}>
        {/* Add any content you want in the right side */}
      </div>
    </div>
  );
};

export default Layout;