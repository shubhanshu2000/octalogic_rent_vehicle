import express from "express";
import errorHandler from "middleware/errorMiddleware";
import vehicleDetails from "./routes/vehicleDetailRoute";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "All Ok" });
});

app.use("/api/vehicle", vehicleDetails);

app.use(errorHandler);
app.listen("3001", () => {
  console.log("app started on 3001");
});
