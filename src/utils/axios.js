import axios from "axios"

const devURL = "http://localhost:4000"
const prodURL = "https://blog-backend-3u5c.onrender.com"

// Creating an instance of axios to make API calls to server
export const axiosInstance = axios.create({
    baseURL: devURL
})