import { useSelector } from "react-redux";
import Login from "@/components/Login";
import Home from "@/pages/home";
import SignUp from "@/components/SignUp";

export default function Index() {
  const token = useSelector((state: any) => state.auth.token);

  // Check if user is logged in
  if (!token) {
    return <SignUp />;
  }

  // User is logged in, render main content
  return <Home />;
}
