import express from "express";
import {
  createadmin,
  loginadmin,
  logoutadmin,
  getcookie,
} from "../controller/adminlogin.js";
const router = express.Router();

router.post("/createadmin", createadmin);
router.post("/loginadmin", loginadmin);
router.post("/logoutadmin", logoutadmin);
router.get("/getcookie", getcookie);

export default router;
