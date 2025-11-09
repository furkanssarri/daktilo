import { Router } from "express";
import {
  userGetPublic,
  userPutPublic,
  userPasswordPutPublic,
} from "../controllers/usersController.js";

const router = Router();

router.get("/me", userGetPublic); // and /api/users/me?include=comments

router.put("/me", userPutPublic);
router.put("/me/password", userPasswordPutPublic);

export default router;
