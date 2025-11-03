import "dotenv/config";
import express from "express";

import passport from "passport";
import "./config/passport.js";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import usersRouter from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/api/auth/", authRouter);

app.use("/api/users/", usersRouter);
app.use("/api/admin/", adminRouter);
app.use("/", indexRouter);

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`listening the app on port ${PORT}...`);
});
