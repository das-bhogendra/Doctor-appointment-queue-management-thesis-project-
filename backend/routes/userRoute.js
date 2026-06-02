import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  getUserProfile,
  listAppointment,
  loginUser,
  makePayment,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";

import { auth } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

//
// ===============================
// PUBLIC ROUTES
// ===============================
//
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//
// ===============================
// USER ONLY ROUTES
// ===============================
//
userRouter.get(
  "/get-profile",
  auth(["user"]),
  getUserProfile
);

userRouter.post(
  "/update-profile",
  auth(["user"]),
  upload.single("image"),
  updateUserProfile
);

userRouter.post(
  "/book-appointment",
  auth(["user"]),
  bookAppointment
);

userRouter.get(
  "/appointments",
  auth(["user"]),
  listAppointment
);

userRouter.post(
  "/cancel-appointment",
  auth(["user"]),
  cancelAppointment
);

userRouter.post(
  "/make-payment",
  auth(["user"]),
  makePayment
);

export default userRouter;