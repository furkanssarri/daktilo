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
import contactRouter from "./routes/contact.js";
import searchRouter from "./routes/search.js";

import path from "node:path";

const app = express();
const __dirname = path.resolve();

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:4173/",
  "https://daktilo.netlify.app/",
];

app.use(cors());
// app.use(
//   cors({
//     origin: allowedOrigins,
//   }),
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);

app.use("/api/contact", contactRouter);
app.use("/api/comments", requireAuth, commentsRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", requireAuth, requireRole("ADMIN", "USER"), usersRouter);
app.use("/api/admin", requireAuth, requireRole("ADMIN"), adminRouter);
app.use("/api/search", searchRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`listening the app on port ${PORT}...`);
});
