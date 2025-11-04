import { Router } from "express";
import {
  createNewPostAdmin,
  deletePostAdmin,
  updatePostAdmin,
  allPostsAdmin,
  postBySlugAdmin,
  publishUnpublishPostAdmin,
} from "../controllers/adminController.js";

import {
  usersGetByAdmin,
  userPutByAdmin,
} from "../controllers/usersController.js";

const router = Router();

// User management
router.get("/users", usersGetByAdmin);
router.put("/users/:id", userPutByAdmin);

// Post management
router.post("/posts", createNewPostAdmin);
router.put("/posts/:id", updatePostAdmin);
router.delete("/posts/:id", deletePostAdmin);

router.get("/posts", allPostsAdmin);
router.get("/posts/:id", postBySlugAdmin);

router.put("/posts/:id/publish", publishUnpublishPostAdmin);
export default router;
