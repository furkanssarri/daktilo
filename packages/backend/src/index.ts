import "dotenv/config";
import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello TS.");
});

app.get("/api/auth/login", (_req, res) => {
  res.send("bye from login.");
});

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Listening the app on port ${PORT}...`);
});
