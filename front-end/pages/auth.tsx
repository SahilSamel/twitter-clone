import React from "react";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import { useState, useEffect } from "react";

const auth = () => {
  const [isLogin, setMode] = useState(true);
  return (
    <div className="flex justify-center flex-col">
      {isLogin ? <Login />:<SignUp />}
      <button onClick={()=>{setMode(false)}}>Change to SignUp Mode</button>
      <button onClick={()=>{setMode(true)}}>Change to Login Mode</button>
    </div>
  );
};


export default auth;
