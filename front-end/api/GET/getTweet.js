import axios from "axios";
import { serverUrl } from "@/constants/appConstant";

const getTweet = async (endpoint, data, func) => {
  try {
    const response = await axios.get( serverUrl + endpoint, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(server + endpoint);
    const jsonData = response.data;
    console.log(jsonData);
    func(null, jsonData);
  } catch (error) {
    func(error, '');
  }
};

export default getTweet;
