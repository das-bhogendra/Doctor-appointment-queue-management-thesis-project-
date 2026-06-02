import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";

//
// ===============================
// CHANGE AVAILABILITY
// ===============================
//
export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    return res.status(200).json({
      success: true,
      message: "Doctor availability updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// ===============================
// DOCTOR LIST
// ===============================
//
export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({})
      .select("-password -email");

    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// ===============================
// DOCTOR LOGIN
// ===============================
//
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: doctor._id,
        role: "doctor",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// ===============================
// GET DOCTOR APPOINTMENTS
// ===============================
//
export const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.user;

    const appointments = await appointmentModel.find({ docId });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// ===============================
// COMPLETE APPOINTMENT
// ===============================
//
export const appointmentComplete = async (req, res) => {
  try {
    const { docId } = req.user;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.docId.toString() !== docId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment completed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// ===============================
// CANCEL APPOINTMENT
// ===============================
//
export const appointmentCancel = async (req, res) => {
  try {
    const { docId } = req.user;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.docId.toString() !== docId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// ===============================
// DOCTOR DASHBOARD
// ===============================
//
export const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.user;

    const appointments = await appointmentModel.find({ docId });

    let earning = 0;
    let patients = [];

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }

      if (!patients.includes(item.userId.toString())) {
        patients.push(item.userId.toString());
      }
    });

    const dashData = {
      earning,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.slice(-5).reverse(),
    };

    return res.status(200).json({
      success: true,
      dashData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// ===============================
// DOCTOR PROFILE
// ===============================
//
export const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.user;

    const profile = await doctorModel
      .findById(docId)
      .select("-password");

    return res.status(200).json({
      success: true,
      profileData: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// ===============================
// UPDATE DOCTOR PROFILE
// ===============================
//
export const updateDoctorProfile = async (req, res) => {
  try {
    const { docId } = req.user;
    const { fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
    });

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};