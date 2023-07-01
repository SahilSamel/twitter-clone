import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Head from 'next/head'

export default function Index() {
  const token = useSelector((state: any) => state.auth.token);
  const router = useRouter();

  // Check if user is logged in
  if (!token) {
    router.push("/auth");
  } else {
    // User is logged in, render main content
    router.push("/home");
  }
}
