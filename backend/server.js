import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

import express from "express";
import cors from "cors";

// DB + Cloudinary
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// APP INIT
const app = express();
const port = process.env.PORT || 8000;

/* =========================
   CONNECT DATABASES FIRST
========================= */
console.log("ENV TEST (CLOUDINARY_NAME):", process.env.CLOUDINARY_NAME);

connectDB();
connectCloudinary();

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(cors({
  origin: "*", // you can restrict later to frontend URL
  credentials: true,
}));

/* =========================
   API ROUTES
========================= */
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

/* =========================
   HEALTH CHECK ROUTE
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Doctor Appointment API is running 🚀",
    status: "healthy",
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

/* =========================
   START SERVER
========================= */
app.listen(port, () => {
  console.log(`🚀 Server running on PORT ${port}`);
});