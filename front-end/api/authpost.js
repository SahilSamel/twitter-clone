import axios from "axios";
import {serverUrl} from "@/constants/appConstant"

const authpost = async (endpoint, data, func) => {
  console.log(endpoint, data);
  try {
    const response = await axios.post(serverUrl + endpoint, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const jsonData = response.data;
    func(null, jsonData);
  } catch (error) {
    console.log(endpoint);
    func(error, '');
  }
};

export default authpost;