import { Router } from "express";
import {
  userGetPublic,
  userPutPublic,
  userPasswordPutPublic,
} from "../controllers/usersController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.get("/me", requireAuth, requireRole("ADMIN", "USER"), userGetPublic);
router.put("/me", requireAuth, requireRole("ADMIN", "USER"), userPutPublic);
router.put(
  "/me/password",
  requireAuth,
  requireRole("ADMIN", "USER"),
  userPasswordPutPublic,
);

export default router;
