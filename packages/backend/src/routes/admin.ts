import { Router } from "express";
import {
  allPostsAdmin,
  createNewPostAdmin,
  deletePostAdmin,
  updatePostAdmin,
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
export default router;
