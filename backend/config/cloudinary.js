import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  console.log("ENV CLOUD NAME:", process.env.CLOUDINARY_NAME);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });

  console.log("✅ CLOUDINARY CONNECTED:", process.env.CLOUDINARY_NAME);
};

export default connectCloudinary;