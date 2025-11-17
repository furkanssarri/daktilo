import { Router } from "express";
import {
  getTagsPublic,
  getTagPublic,
  getPostsByTagPublic,
} from "../controllers/categoryTagController.js";
const router = Router();

router.get("/", getTagsPublic);
router.get("/:name", getTagPublic);
router.get("/name/posts", getPostsByTagPublic);

export default router;
