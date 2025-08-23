import axios from "axios";
import router from "./router";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
});

// axiosClient.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
//   return config;
// });

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      router.push({ name: "Login" });
    } else {
      // Handle other errors
      throw error;
    }
  }
);
export default axiosClient;
