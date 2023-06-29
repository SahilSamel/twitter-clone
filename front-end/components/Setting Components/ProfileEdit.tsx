import React, { useState, useEffect } from "react";
import SettingsHeader from "./SettingsHeader";
import GET from "@/api/GET/GET";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import APIPOST from "@/api/POST/APIPOST";

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

  const fetchUserData = () => {
    GET(
      `/profile/getProfile?userHandle=${userhandle}`,
      function (err: any, data: any) {
        if (err) {
          console.log(err, "error at axios");
        } else {
          const { userName, bio, location, birthdate } = data;
          if(birthdate){
            const formattedDate = birthdate.split('T')[0];
            setUserData({ userName, bio, location, birthdate:formattedDate });

          }else{
            setUserData({ userName, bio, location, birthdate});
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

  return (
    <div className="h-full">
      <SettingsHeader
        title="Your Settings"
        subtitle="Edit your profile settings"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-around"
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
