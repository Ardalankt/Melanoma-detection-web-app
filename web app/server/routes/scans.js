import express from "express";
import {
  analyzeSkin,
  getScanHistory,
  getScanById,
  deleteScan,
} from "../controllers/scans.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log(
      "Multer processing file:",
      file.originalname,
      "mimetype:",
      file.mimetype
    );

    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpeg, jpg, png) are allowed!"));
  },
});

router.post(
  "/analyze",
  (req, res, next) => {
    console.log("Received request to /api/scans/analyze");
    console.log("Request headers:", req.headers);

    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        console.error("No file uploaded");
        return res.status(400).json({ message: "No image file provided" });
      }

      console.log("File uploaded successfully:", req.file);
      next();
    });
  },
  analyzeSkin
);

router.get("/history", getScanHistory);

router.get("/:id", getScanById);

router.delete("/:id", deleteScan);

export default router;
