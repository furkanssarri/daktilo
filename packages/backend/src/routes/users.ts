import { Router } from "express";
import {
  userGetPublic,
  userPutPublic,
  userPasswordPutPublic,
  userGetCommentsPublic,
} from "../controllers/usersController.js";

const router = Router();

router.get("/me", userGetPublic);
router.get("/me/comments", userGetCommentsPublic);
router.put("/me", userPutPublic);
router.put("/me/password", userPasswordPutPublic);

export default router;
