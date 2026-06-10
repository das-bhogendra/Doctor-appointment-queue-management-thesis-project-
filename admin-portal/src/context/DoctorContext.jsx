import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (dToken) {
      localStorage.setItem("dToken", dToken);
    } else {
      localStorage.removeItem("dToken");
    }
  }, [dToken]);

  // ✅ AUTH HEADER
  const getAuthHeader = () => {
    const token = localStorage.getItem("dToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // APPOINTMENTS
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        getAuthHeader()
      );
      if (data.success) setAppointments(data.appointments);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // COMPLETE
  const completeAppointment = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId: id },
        getAuthHeader()
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // CANCEL
  const cancelAppointment = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId: id },
        getAuthHeader()
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // DASHBOARD
  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashboard`,
        getAuthHeader()
      );
      if (data.success) setDashData(data.dashData);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // PROFILE
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/profile`,
        getAuthHeader()
      );
      if (data.success) setProfileData(data.profileData);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <DoctorContext.Provider
      value={{
        dToken,
        setDToken,
        appointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,
        getDashData,
        profileData,
        getProfileData,
        setProfileData,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;