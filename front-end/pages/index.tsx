import { useEffect } from "react";
import { useRouter } from "next/router";
import GET from "@/api/GET/GET";

export default function Index() {
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

  return null; // Return null or any loading indicator as the component doesn't render any content
}
