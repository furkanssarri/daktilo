import { Router } from "express";
import type { Request, Response } from "express";
import {
  loginValidator,
  signupValidator,
} from "../validators/authValidator.js";
import { validate } from "../middlewares/validate.js";

import {
  loginUser,
  refreshToken,
  signup,
} from "../controllers/authController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/signup", signupValidator, validate, signup);

router.get("/signup", (_req, res) => {
  res.json({
    status: "success",
    message: "Welcome to the SIGNUP page!",
  });
});

router.post("/auth/refresh", refreshToken);
router.post("/login", loginValidator, validate, loginUser);

router.post("/logout", requireAuth, (_req: Request, res: Response) => {
  res.json({
    status: "success",
    message:
      "Logout successful. Make sure to remove JWT token from LocalStorage.",
  });
});
export default router;
