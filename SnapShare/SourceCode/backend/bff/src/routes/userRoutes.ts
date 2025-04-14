import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from "../controllers/user.controller";

const router = Router();

// Get all users
router.get("/", getAllUsers);

// Get a specific user by ID
router.get("/:id", getUserById);

// Create a new user
router.post("/register", createUser);

// Update a user by ID
router.put("/:id", updateUserById);

// Delete a user by ID
router.delete("/:id", deleteUserById);

export default router;