import { Router } from "express";
import {
  getCommentsPublic,
  getCommentPublic,
  createCommentPublic,
  updateCommentPublic,
  deleteCommentPublic,
} from "../controllers/commentsController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { createCommentValidator } from "../validators/commentValidator.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

// ===============================
//  Public comment routes
// ===============================

// Get all approved comments
router.get("/", getCommentsPublic);

// Get a single approved comment by ID
router.get("/:id", getCommentPublic);

// Create a new comment (must be logged in)
router.post(
  "/",
  requireAuth,
  createCommentValidator,
  validate,
  createCommentPublic,
);

// Update an existing comment (only owner can update)
router.put("/:id", requireAuth, updateCommentPublic);

// Delete a comment (only owner can delete)
router.delete("/:id", requireAuth, deleteCommentPublic);

export default router;
