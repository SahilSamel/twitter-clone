import React from "react";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import { useState } from "react";

const Auth = () => {
  const [isLogin, setMode] = useState(true);

  const toggleForm = () => {
    setMode(!isLogin);
  };

  return (
    <div className="flex justify-center flex-col">
      {isLogin ? <Login toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
    </div>
  );
};

export default Auth;
