import React, { useState, useEffect } from "react";
import SettingsHeader from "./SettingsHeader";
import GET from "@/api/GET/GET";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import APIPOST from "@/api/POST/APIPOST";
import Image from "next/image";
import ProfileImage from "../ProfileImage";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadFile } from "@/utils/uploadImage";

type FormValues = {
  userName: string;
  bio: string;
  location: string;
  birthdate: string;
};

const ProfileEdit = () => {
  const userhandle = useSelector((state: any) => state.auth.userHandle);
  const token = useSelector((state: any) => state.auth.token);

  const [userData, setUserData] = useState<FormValues>({
    userName: "",
    bio: "",
    location: "",
    birthdate: "",
  });

  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [bgImageURL, setbgImageURL] = useState("");
  const [profileImageURL, setprofileImageURL] = useState("");

  const fetchUserData = () => {
    GET(
      `/profile/getProfile?userHandle=${userhandle}`,
      function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          const { userName, bio, location, birthdate, bgImageURL,profileImageURL } = data;
          setbgImageURL(bgImageURL);
          setprofileImageURL(profileImageURL);

          if (birthdate) {
            const formattedDate = birthdate.split("T")[0];
            setUserData({ userName, bio, location, birthdate: formattedDate });
          } else {
            setUserData({ userName, bio, location, birthdate });
          }
        }
      }
    );
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    reset(userData);
  }, [userData, reset]);

  const onSubmit = (data: FormValues) => {
    APIPOST(
      "/profile/updateProfile",
      token,
      data,
      function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          console.log(data);
        }
      }
    );
    console.log(data);
  };

  const userId = useSelector((state: any) => state.auth.userId);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = await uploadFile(file, userId, type);

      const data = { [type]: fileUrl }; // Create an object with dynamic key using computed property name

      APIPOST(
        "/profile/updateImage",
        token,
        data,
        function (err: any, data: any) {
          if (err) {
            console.log(err, "error at axios");
          } else {
            console.log(fileUrl);
            if (data.message === "Updated") {
              if (type == "bgImageURL") {
                setbgImageURL(fileUrl);
              }else{
                setprofileImageURL(fileUrl);
              }
            }
          }
        }
      );
    }
  };

  return (
    <div className="h-full">
      <SettingsHeader
        title="Your Settings"
        subtitle="Edit your profile settings"
      />
      <div>
        <div className="relative">
          <div style={{ height: 200 }} className="relative">
            <Image
              src={
                bgImageURL === ""
                  ? "/../public/assets/defaultBG.png"
                  : bgImageURL
              }
              fill={true}
              alt="Picture of the author"
            />
          </div>
          <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-slate-900 opacity-50">
            <input
              type="file"
              id="bgImageUpload"
              accept="image/*"
              onChange={(event) => handleImageSelect(event, "bgImageURL")}
              style={{ display: "none" }}
            />
            <label htmlFor="bgImageUpload">
              <AiOutlineCloudUpload className="text-6xl hover:cursor-pointer" />
            </label>
          </div>
        </div>

        <div className="relative bottom-16 left-5">
          <Image
            src={
              profileImageURL == ""
                ? "/../public/assets/defaultPFP.jpg"
                : profileImageURL
            }
            width={135}
            height={135}
            alt="Picture of the author"
            className="absolute rounded-full border-solid border-4 border-black"
          />
          <div
            style={{
              position: "absolute",
              width: 135,
              height: 135,
            }}
            className="rounded-full absolute top-0 left-0 flex justify-center items-center bg-slate-900  opacity-50"
          >
            <input
              type="file"
              id="profileImageUpload"
              accept="image/*"
              onChange={(event) => handleImageSelect(event, "profileImageURL")}
              style={{ display: "none" }}
            />

            <label htmlFor="profileImageUpload">
              <AiOutlineCloudUpload className="text-6xl hover:cursor-pointer" />
            </label>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-around mt-20"
      >
        <div>
          <label className="block text-slate-200 text-sm font-bold mb-2">
            Username
          </label>
          <input {...register("userName")} defaultValue={userData.userName} />
        </div>
        <div>
          <label className="block text-slate-200 text-sm font-bold mb-2">
            Bio
          </label>
          <input {...register("bio")} defaultValue={userData.bio} />
        </div>
        <div>
          <label className="block text-slate-200 text-sm font-bold mb-2">
            Location
          </label>
          <input {...register("location")} defaultValue={userData.location} />
        </div>
        <div>
          <label className="block text-slate-200 text-sm font-bold mb-2">
            BirthDate
          </label>
          <input
            {...register("birthdate")}
            type="date"
            defaultValue={userData.birthdate}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProfileEdit;
