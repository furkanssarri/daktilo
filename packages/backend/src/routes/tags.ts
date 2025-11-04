import { Router } from "express";
import {
  getTagsPublic,
  getTagPublic,
  getPostsByTagPublic,
} from "../controllers/categoryTagController.js";
const router = Router();

router.get("/tags", getTagsPublic);
router.get("/tags/:name", getTagPublic);
router.get("/tags/:name/posts", getPostsByTagPublic);

export default router;
