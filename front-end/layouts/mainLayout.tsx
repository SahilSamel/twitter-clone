import React from "react";
import Sidebar from "@/components/Sidebar";
import { useWindowSize } from "@/utils/Windowsize"; // Custom hook for getting window size
import CreateTweet from "@/components/CreateTweet";

const Layout = (props: any) => {
  const { middleComponent: MiddleComponent } = props;
  const { width } = useWindowSize(); // Get window width using custom hook
  const isMobile = width <= 1222;
  const showRight = width >= 1024;

  return (
    <div style={{ display: "flex", height: "100vh" , justifyContent:"center"}}>
      <div
        style={{
          flex: isMobile ? "0 0 10%" : "31%",
          minWidth: "80px",
          display: "flex",
          justifyContent: "flex-end",
          padding: "20px",
        }}
      >
        <Sidebar />
      </div>
      <div
        style={{
          flex: "0 0 600px",
          maxWidth: "600px",
        }}
      >
        {props.list=="getRefreshCache"?<CreateTweet/>:<div></div>}
        <MiddleComponent {...props} />
      </div>
      {showRight ? (
        <div
          style={{
            flex: "37%",
            backgroundColor: "blue",
          }}
        >
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Layout;
