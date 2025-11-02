import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "Welcome to Daktilo!",
  });
});

router.get("/profile", requireAuth, (req, res) => {
  res.json({
    status: "success",
    message: "Access granted",
    data: {
      user: req.user,
    },
  });
});

export default router;
