import React from 'react';
import Layout from '@/layouts/mainLayout';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import ProfileEdit from '@/components/Setting Components/ProfileEdit';
const ProfileSettings = () => {
  const token = useSelector((state:any) => state.auth.token);
  const router = useRouter();
  if(!token){
    router.push("/auth");
    return;
  }

  return (
    <Layout middleComponent={ProfileEdit} />

  );
};

export default ProfileSettings;