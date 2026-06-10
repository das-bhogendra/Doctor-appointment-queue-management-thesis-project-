import express from "express";
import {
  appointmentCancel,
  appointmentComplete,
  appointmentsDoctor,
  doctorDashboard,
  doctorList,
  doctorProfile,
  loginDoctor,
  updateDoctorProfile,
} from "../controllers/doctorController.js";

import { auth } from "../middlewares/auth.js";

const doctorRouter = express.Router();


doctorRouter.get("/lists", doctorList);
doctorRouter.post("/login", loginDoctor);

//
// ===============================
// DOCTOR ONLY ROUTES
// ===============================
//
doctorRouter.get(
  "/appointments",
  auth(["doctor"]),
  appointmentsDoctor
);

doctorRouter.post(
  "/complete-appointment",
  auth(["doctor"]),
  appointmentComplete
);

doctorRouter.post(
  "/cancel-appointment",
  auth(["doctor"]),
  appointmentCancel
);

doctorRouter.get(
  "/dashboard",
  auth(["doctor"]),
  doctorDashboard
);

doctorRouter.get(
  "/profile",
  auth(["doctor"]),
  doctorProfile
);

doctorRouter.post(
  "/update-profile",
  auth(["doctor"]),
  updateDoctorProfile
);

export default doctorRouter;