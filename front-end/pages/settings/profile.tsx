import React, { useEffect } from "react";
import Layout from '@/layouts/mainLayout';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import GET from "@/api/GET/GET";
import ProfileEdit from '@/components/Setting Components/ProfileEdit';
const ProfileSettings = () => {
  const router = useRouter();
  useEffect(() => {
    const checkAuth = () => {
      GET("/auth/checkLogin", function (err: any, data: any) {
        if (err) {
          router.push("/auth");
          return;
        }
      });
    };
    
    checkAuth();
  }, []); // Empty dependency array to ensure the effect runs only once
  return (
    <Layout middleComponent={ProfileEdit} />
  );
};

export default ProfileSettings;