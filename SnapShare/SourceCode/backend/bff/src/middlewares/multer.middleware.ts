import multer from "multer";
import express from "express";

const storage = multer.memoryStorage(); // Store files in memory
export const upload = multer({storage, limits: { fileSize: 750 * 1024 * 1024 } });


// Middleware to parse form fields and files
export const parseFormData = [
    express.urlencoded({ extended: true, limit: '750mb' }), // Parse form fields into req.body
    upload.array("files"), // Parse files into req.files
  ];