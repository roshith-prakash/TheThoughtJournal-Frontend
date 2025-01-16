import axios from "axios";

export const devURL = "http://localhost:4000";
export const prodURL = "https://blog-backend-3u5c.onrender.com";
export const newProd = "https://blog-backend-seven-delta.vercel.app/";

// Creating an instance of axios to make API calls to server
export const axiosInstance = axios.create({
  baseURL: devURL,
});
