import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authentication.controller";

const router = Router();

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

export default router;