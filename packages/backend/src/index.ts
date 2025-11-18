import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";

import { requireAuth } from "./middlewares/requireAuth.js";
import { requireRole } from "./middlewares/requireRole.js";

import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import categoryRouter from "./routes/category.js";
import tagsRouter from "./routes/tags.js";
import commentsRouter from "./routes/comment.js";
import path from "node:path";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.use(passport.initialize());

app.use("/api/auth", authRouter);

app.use("/api/comments", requireAuth, commentsRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", requireAuth, requireRole("ADMIN", "USER"), usersRouter);
app.use("/api/admin", requireAuth, requireRole("ADMIN"), adminRouter);

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`listening the app on port ${PORT}...`);
});
