import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authentication.controller";
import { validateRequest } from "../middlewares/validations.middleware";
import { registerValidationSchema, loginValidationSchema } from "../validation/auth.validation";
import { parseFormData } from "../middlewares/multer.middleware";

const router = Router();

// Register a new user
router.post("/register", parseFormData, validateRequest(registerValidationSchema), registerUser);

// Login a user
router.post("/login", validateRequest(loginValidationSchema), loginUser);

export default router;