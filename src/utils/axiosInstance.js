// src/utils/axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";
import env from "../env";

const token = Cookies.get("jwtToken");
console.log("token", token);
const axiosInstance = axios.create({
  baseURL: env.SERVER_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;
