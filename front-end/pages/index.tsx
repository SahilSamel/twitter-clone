import { useSelector } from "react-redux";
import Login from "@/components/Login";
import Home from "@/pages/home";

export default function Index() {
  const token = useSelector((state: any) => state.auth.token);

  // Check if user is logged in
  if (!token) {
    return <Login />;
  }

  // User is logged in, render main content
  return <Home />;
}
