import { Router } from "express";
import type { Request, Response } from "express";
import { ResponseJsonObject } from "../types/response.js";

import {
  loginUser,
  refreshToken,
  signup,
} from "../controllers/authController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/signup", signup);

router.get("/signup", (_req, res) => {
  res.json({
    status: "success",
    message: "Welcome to the SIGNUP page!",
  });
});

router.post("/auth/refresh", refreshToken);
router.post("/login", loginUser);
router.get("/login", (_req: Request, res: Response<ResponseJsonObject>) => {
  res.json({
    status: "success",
    message: "Welcome to the LOGIN page.",
  });
});
router.post(
  "/logout",
  requireAuth,
  (_req: Request, res: Response<ResponseJsonObject>) => {
    res.json({
      status: "success",
      message:
        "Logout successful. Make sure to remove JWT token from LocalStorage.",
    });
  },
);
export default router;
