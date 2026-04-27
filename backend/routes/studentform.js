
import express from "express";
import {
  findStudent,
  addStudent,
  updateFees,
  syncToSheets,getAllStudents,getMonthlyStats
} from "../controller/studentform.js";

const router = express.Router();

// 1. Find Student by Name (Query Parameter use karein: /find?name=Rahul)
router.get("/find", findStudent);

// 2. Add New Student (Naya record create karne ke liye)
router.post("/add", addStudent);

// 3. Update Existing Student (Fees/Dues update karne ke liye)
router.put("/update-fees", updateFees);

// 4. Manual Sync (Agar kabhi jarurat pade manually sheet update karne ki)
router.get("/sync", syncToSheets);

router.get("/all", getAllStudents);

router.get("/monthly-stats", getMonthlyStats);

export default router;