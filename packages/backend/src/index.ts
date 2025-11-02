import "dotenv/config";
import express from "express";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth/", authRouter);
app.use("/", indexRouter);

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`listening the app on port ${PORT}...`);
});
