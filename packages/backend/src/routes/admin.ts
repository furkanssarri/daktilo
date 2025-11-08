import { Router } from "express";
import {
  createNewPostAdmin,
  deletePostAdmin,
  updatePostAdmin,
  getAllPostsAdmin,
  postBySlugAdmin,
  publishUnpublishPostAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  createTagAdmin,
  updateTagAdmin,
  deleteTagAdmin,
  updateCommentAdmin,
  deleteCommentAdmin,
  approveDisapproveCommentsAdmin,
  uploadPostImageAdmin,
} from "../controllers/adminController.js";

import {
  usersGetByAdmin,
  userPutByAdmin,
} from "../controllers/usersController.js";

import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ===============================
//  User management
// ===============================
router.get("/users", usersGetByAdmin);
router.put("/users/:id", userPutByAdmin);

// ===============================
//  Post management
// ===============================
router.post("/posts", createNewPostAdmin);
router.put("/posts/:id", updatePostAdmin);
router.delete("/posts/:id", deletePostAdmin);

router.get("/posts", getAllPostsAdmin);
router.get("/posts/:slug", postBySlugAdmin);

router.put("/posts/:id/publish", publishUnpublishPostAdmin);

// ===============================
//  Comment management
// ===============================

// Update a comment (admin)
router.put("/comments/:id", updateCommentAdmin);

// Delete a comment (admin)
router.delete("/comments/:id", deleteCommentAdmin);

// Approve or disapprove comment
router.put("/comments/:id/approval", approveDisapproveCommentsAdmin);

// ===============================
//  Category management
// ===============================
router.post("/categories", createCategoryAdmin);
router.put("/categories/:id", updateCategoryAdmin);
router.delete("/categories/:id", deleteCategoryAdmin);

// ===============================
//  Tag management
// ===============================
router.post("/tags", createTagAdmin);
router.put("/tags/:id", updateTagAdmin);
router.delete("/tags/:id", deleteTagAdmin);

router.post("/upload", upload.single("file"), uploadPostImageAdmin);

export default router;
