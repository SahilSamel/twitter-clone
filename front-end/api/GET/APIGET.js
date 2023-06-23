import axios from "axios";
import { serverUrl } from "@/constants/appConstant";

const APIGET = async (endpoint, token, func) => {
  console.log("asdad");
  try {
    const response = await axios.get(serverUrl + endpoint, {
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    });

    const jsonData = response.data;
    func(null, jsonData);
  } catch (error) {
    console.log(serverUrl + endpoint);
    func(error, "");
  }
};

export default APIGET;
