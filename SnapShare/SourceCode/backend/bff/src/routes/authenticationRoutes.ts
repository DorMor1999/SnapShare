import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
    res.send("Create a user");
  });

router.post("/login", (req, res) => {
    res.send("Create a user");
});
  