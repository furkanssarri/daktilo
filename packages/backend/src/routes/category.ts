import { Router } from "express";
import {
  getCategoriesPublic,
  getCategoryPublic,
  getPostsByCategoryPublic,
} from "../controllers/categoryTagController.js";

const router = Router();

router.get("/", getCategoriesPublic);
router.get("/:name", getCategoryPublic);
router.get("/:name/posts", getPostsByCategoryPublic);

export default router;
