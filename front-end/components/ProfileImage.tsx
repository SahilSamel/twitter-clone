import Image from "next/image";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import GET from "@/api/GET/GET";

const ProfileImage = ({ width = 400, height = 400, ...restProps }) => {
  const [PFPURL, setPFPURL] = useState("");
  const userHandle = useSelector((state: any) => state.auth.userHandle);

  useEffect(() => {
    GET(
      `/profile/getProfile?userHandle=${userHandle}`,
      (err: any, data: any) => {
        if (err) {
          console.log(err, "error at axios");
        } else {
          setPFPURL(data.profileImageURL);
        }
      }
    );
  }, [userHandle]);
  return (
    <Image
      src={(PFPURL!="")?PFPURL:"/../public/assets/defaultPFP.jpg"}
      width={width}
      height={height}
      alt="Picture of the author"
      {...restProps}
    />
  );
};

export default ProfileImage;
