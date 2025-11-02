import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "Welcome to Daktilo!",
  });
});

export default router;
