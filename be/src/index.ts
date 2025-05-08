import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "All Ok" });
});

app.listen("3001", () => {
  console.log("app started on 3001");
});
