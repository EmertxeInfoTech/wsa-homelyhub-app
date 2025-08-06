import axios from "axios";
import qs from "qs";

// Serialization means converting a JavaScript object or array into a URL query string that can be sent in an HTTP request.

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});
