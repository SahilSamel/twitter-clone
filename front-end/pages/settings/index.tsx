import React from 'react';
import Layout from '@/layouts/mainLayout';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import SettingsHome from '@/components/Setting Components/SettingHome';

const Settings = () => {
  const token = useSelector((state:any) => state.auth.token);
  const router = useRouter();
  if(!token){
    router.push("/auth");
    return;
  }

  return (
    <Layout middleComponent={SettingsHome} />

  );
};

export default Settings;