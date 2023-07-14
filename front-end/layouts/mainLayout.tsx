import React from "react";
import Sidebar from "@/components/Sidebar";
import { useWindowSize } from "@/utils/Windowsize"; // Custom hook for getting window size
import CreateTweet from "@/components/CreateTweet";
import Rightbar from "@/components/Rightbar";

const Layout = (props: any) => {
  const { middleComponent: MiddleComponent } = props;

  return (
    <div className="flex justify-center static mobile:static">
      <div className="flex flex-initial desktop:justify-start sticky top-0 px-2 tablet:justify-end"
      style={{
        width:"100%",
        maxWidth:"275px"
      }}
      >
        <Sidebar />
      </div>
      <div className="flex flex-col shrink-0 grow-1 tablet:mr-5 mobile:mr-0"
      style={{
        width:"100%",
        maxWidth:"600px"
      }}>
        {props.list == "refresh" ? <CreateTweet type="0" /> : <div></div>}
        <MiddleComponent {...props} />
      </div>
      <div className="flex flex-initial justify-start sticky top-0 tablet:hidden"
      style={{
        width:"100%",
        maxWidth:"350px",
        minWidth:"50px"
      }}
      >
        <Rightbar />
      </div>
    </div>
  );
};

export default Layout;
