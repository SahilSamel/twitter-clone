import axios from "axios";
import { serverUrl } from "@/constants/appConstant";

const APIPOST = async (endpoint,token, data, func) => {

  try {
    const response = await axios.post(serverUrl + endpoint, data, {
      headers: {
        "content-type": "application/json",
        "Authorization": token,
      }
    });
    const jsonData = response.data;
    func(null, jsonData);
  } catch (error) {
    console.log(endpoint);
    console.log(error);
    func(error, "");
  }
};

export default APIPOST;
