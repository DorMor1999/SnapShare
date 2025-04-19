import { Request, Response } from "express";
import { createUserService } from "../services/user.service";
import { getUserByEmailService } from "../services/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // Create the user
    const newUser = await createUserService({
      firstName,
      lastName,
      email,
      hashedPassword,
      phoneNumber,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await getUserByEmailService(email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY || "secret", {
            expiresIn: process.env.JWT_EXPIRATION_TIME || "1h",
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Failed to login", error });
    }
};