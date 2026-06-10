import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);

  // keep backward compatibility with older components
  // (Dashboard.jsx expects getDashData to exist)


  // sync token
  useEffect(() => {
    if (aToken) {
      localStorage.setItem("aToken", aToken);
    } else {
      localStorage.removeItem("aToken");
    }
  }, [aToken]);

  // ✅ AUTH HEADER (IMPORTANT)
  const getAuthHeader = () => {
    const token = localStorage.getItem("aToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // GET DOCTORS
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-doctors`,
        getAuthHeader()
      );
      if (data.success) setDoctors(data.doctors);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // CHANGE AVAILABILITY
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        getAuthHeader()
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // APPOINTMENTS
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/appointments`,
        getAuthHeader()
      );
      if (data.success) setAppointments(data.appointments);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // CANCEL
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        getAuthHeader()
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // DASHBOARD
  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/dashboard`,
        getAuthHeader()
      );
      if (data.success) setDashData(data.dashData);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;