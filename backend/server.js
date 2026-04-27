import express from "express";
import mongoose from "mongoose";
import studentRoutes from "./routes/studentform.js";
import adminloginRoutes from "./routes/adminlogin.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Use Routes
app.use("/api/students", studentRoutes);
app.use("/api/adminlogin", adminloginRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});

