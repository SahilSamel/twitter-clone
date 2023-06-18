import axios from "axios";
import {serverUrl} from "@/constants/appConstant"
const post = async (endpoint,data,func,timeout=10000) => {

    try {
      const response = await axios.post(serverUrl + endpoint, data, {
        headers: {
          'Content-Type': 'application/json',

        },
        // Add any additional options as needed
      });
  
      console.log(response.data);
      // Handle the response data or perform any necessary actions
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  };

export default post;