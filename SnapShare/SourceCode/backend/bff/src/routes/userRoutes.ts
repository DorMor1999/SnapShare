import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Get all users");
});

router.post("/", (req, res) => {
  res.send("Create a user");
});

export default router;
