import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/users.js";

const router = express.Router();

router.get("/profile", getUserProfile);

router.put("/profile", updateUserProfile);

router.put("/change-password", changePassword);

export default router;
