import axios from "axios";
import { serverUrl } from "@/constants/appConstant";

const getTweetList = async (endpoint, data, func) => {
  try {
    const response = await axios.get( serverUrl + endpoint, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const jsonData = response.data;
    func(null, jsonData);
  } catch (error) {
    func(error, '');
  }
};

export default getTweetList;