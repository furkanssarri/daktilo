import { error } from "console";
import { Router } from "express";

import { loginUser, signup } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);

router.get("/signup", (_req, res) => {
  res.json({
    status: "success",
    message: "Welcome to the SIGNUP page!",
  });
});

router.post("/login", loginUser);

export default router;
