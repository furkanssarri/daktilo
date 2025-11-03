import { Router } from "express";
import {
  allPostsGetPublic,
  singlePostBySlugPublic,
  singlePostCommentsPublic,
  likePostUser,
  commentPostUser,
} from "../controllers/postsController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.get("/", allPostsGetPublic);
router.get("/:slug", singlePostBySlugPublic);
router.get("/:id/comments", singlePostCommentsPublic);

// Auth protected routes
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
