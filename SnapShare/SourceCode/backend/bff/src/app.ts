import express from "express";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";
import dotenv from "dotenv";
import connectDB from "./config/db";

const envFile = process.env.NODE_ENV === "production" ? ".env" : `.env.${process.env.NODE_ENV || "dev"}`;
dotenv.config({ path: envFile });
const app = express();

connectDB();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/authentication", authenticationRoutes); // Assuming you have authentication routes

export default app;