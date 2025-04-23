import multer from "multer";
import { Request } from "express";

// Configure multer storage
const storage = multer.memoryStorage(); // Store files in memory (can be changed to disk or cloud storage)

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only jpeg/jpg files
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg/jpg images are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });