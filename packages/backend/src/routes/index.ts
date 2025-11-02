import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "Welcome to Daktilo!",
  });
});

router.get(
  "/admin-dashboard",
  requireAuth,
  requireRole("ADMIN"),
  (req, res) => {
    res.json({
      status: "success",
      message: "Welcome to the admin dashboard!",
      user: req.user,
    });
  },
);

router.get(
  "/profile",
  requireAuth,
  requireRole("USER", "ADMIN"),
  (req, res) => {
    res.json({
      status: "success",
      message: "Access granted",
      data: {
        user: req.user,
      },
    });
  },
);

export default router;
