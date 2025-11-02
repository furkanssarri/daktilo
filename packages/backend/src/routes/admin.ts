import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

import {
  usersGetByAdmin,
  userPutByAdmin,
} from "../controllers/usersController.js";

const router = Router();

router.get("/users", requireAuth, requireRole("ADMIN"), usersGetByAdmin);
router.put("/users/:id", requireAuth, requireRole("ADMIN"), userPutByAdmin);

export default router;
