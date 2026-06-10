import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8000",
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("aToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default adminApi;