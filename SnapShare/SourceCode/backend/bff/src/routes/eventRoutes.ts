import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Get all events");
});

router.post("/", (req, res) => {
  res.send("Create an event");
});

export default router;
