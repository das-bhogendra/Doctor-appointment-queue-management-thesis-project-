import express from "express";
import {
  addDoctor,
  adminDashboard,
  appointmentCancelAdmin,
  appointmentsAdmin,
  getAllDoctors,
  loginAdmin,
} from "../controllers/adminController.js";

import upload from "../middlewares/multer.js";
import { auth } from "../middlewares/auth.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

//
// ===============================
// PUBLIC ROUTE (NO TOKEN)
// ===============================
//
adminRouter.post("/login", loginAdmin);

//
// ===============================
// ADMIN ONLY ROUTES
// ===============================
//
adminRouter.post(
  "/add-doctor",
  auth(["admin"]),
  upload.single("image"),
  addDoctor
);

adminRouter.get(
  "/all-doctors",
  auth(["admin"]),
  getAllDoctors
);

adminRouter.post(
  "/change-availability",
  auth(["admin"]),
  changeAvailability
);

adminRouter.get(
  "/appointments",
  auth(["admin"]),
  appointmentsAdmin
);

adminRouter.post(
  "/cancel-appointment",
  auth(["admin"]),
  appointmentCancelAdmin
);

adminRouter.get(
  "/dashboard",
  auth(["admin"]),
  adminDashboard
);

export default adminRouter;