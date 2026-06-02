import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";

const MAX_USERS = 100;

//
// ===============================
// REGISTER USER
// ===============================
//
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const userCount = await userModel.countDocuments();
    if (userCount >= MAX_USERS) {
      return res.status(403).json({
        success: false,
        message: "User limit reached",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
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
// LOGIN USER
// ===============================
//
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
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
// GET USER PROFILE
// ===============================
//
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      userData,
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
// UPDATE USER PROFILE
// ===============================
//
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, phone, address, dob, gender } = req.body;
    const imgFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    const updateData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    };

    await userModel.findByIdAndUpdate(userId, updateData);

    if (imgFile) {
      const upload = await cloudinary.uploader.upload(imgFile.path, {
        resource_type: "image",
      });

      await userModel.findByIdAndUpdate(userId, {
        image: upload.secure_url,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated",
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
// BOOK APPOINTMENT
// ===============================
//
export const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { docId, slotDate, slotTime } = req.body;

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    let slots = doctor.slots_booked || {};

    if (!slots[slotDate]) {
      slots[slotDate] = [];
    }

    if (slots[slotDate].includes(slotTime)) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    slots[slotDate].push(slotTime);

    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked: slots,
    });

    const appointment = await appointmentModel.create({
      userId,
      docId,
      slotDate,
      slotTime,
      date: Date.now(),
    });

    return res.status(200).json({
      success: true,
      appointment,
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
// LIST APPOINTMENTS
// ===============================
//
export const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await appointmentModel.find({ userId });

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
// CANCEL APPOINTMENT
// ===============================
//
export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    appointment.cancelled = true;
    await appointment.save();

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
// MAKE PAYMENT
// ===============================
//
export const makePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.payment = true;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};