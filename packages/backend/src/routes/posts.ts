// packages/backend/src/routes/posts.ts
import { Router } from "express";
import {
  allPostsGetPublic,
  singlePostBySlugPublic,
  // singlePostCommentsPublic,
  likePostUser,
  commentPostUser,
  singlePostByIdPublic,
} from "../controllers/postsController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

// Public routes
router.get("/", allPostsGetPublic);
router.get("/slug/:slug", singlePostBySlugPublic);
router.get("/id/:id", singlePostByIdPublic);
// router.get("/:id/comments", singlePostCommentsPublic); // removed due to query builder refactor

// Auth-protected routes
router.post(
  "/:id/like",
  requireAuth,
  requireRole("ADMIN", "USER"),
  likePostUser,
);

router.post(
  "/:id/comment",
  requireAuth,
  requireRole("ADMIN", "USER"),
  commentPostUser,
);

export default router;
