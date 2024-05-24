import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

export default function initCommon() {
  dotenv.config();

  if (process.env.IN_DEPLOY) {
    process.env.NODE_ENV = "production";
  }

  if (process.env.NODE_ENV === "production") {
    cloudinary.config({
      secure: true,
      cloud_name: process.env.CLOUDINARY_CLOUD,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }
}
