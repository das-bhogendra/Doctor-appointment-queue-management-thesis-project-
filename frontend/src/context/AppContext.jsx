import { createContext } from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../service/api";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch doctors");
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await api.get("/api/user/get-profile");

      if (data.success) {
        setUserData(data.userData);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load user profile"
      );
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const value = {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    getDoctorsData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

