import React, { useEffect } from "react";
import Layout from "@/layouts/mainLayout";
import { useRouter } from "next/router";
import TweetList from "@/layouts/ListTweetsLayout";
import GET from "@/api/GET/GET";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      GET("/auth/checkLogin", function (err: any, data: any) {
        if (err) {
          router.push("/auth");
        } else {
          router.push("/home");
        }
      });
    };

    checkAuth();
  }, []); // Empty dependency array to ensure the effect runs only once

  return <Layout middleComponent={TweetList} list="refresh" />;
};

export default Home;
