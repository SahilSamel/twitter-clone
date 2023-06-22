import { useState } from "react";
import { useSelector } from "react-redux";
import Login from "@/components/Login";
import Home from "@/pages/home";
import SignUp from "@/components/SignUp";
import { useRouter } from 'next/router';

export default function Index() {
  const [showLogin, setShowLogin] = useState(true);
  const token = useSelector((state: any) => state.auth.token);
  const router = useRouter();

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  // Check if user is logged in
  if (!token) {
    return showLogin ? <Login toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />;
  }

  // User is logged in, render main content
  router.push('/home');
}

