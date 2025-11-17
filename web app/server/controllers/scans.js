import Scan from "../models/Scan.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:5040";

export const analyzeSkin = async (req, res) => {
  try {
    console.log("Request received for image analysis");

    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({ message: "No image file provided" });
    }

    const { patientName, patientAge, patientGender } = req.body;

    if (!patientName || !patientAge || !patientGender) {
      console.error("Patient information missing");
      return res
        .status(400)
        .json({ message: "Patient information is required" });
    }

    console.log("File details:", {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    const imagePath = req.file.path;
    console.log("Image saved to:", imagePath);

    try {
      if (!fs.existsSync(imagePath)) {
        console.error("File does not exist at path:", imagePath);
        return res.status(400).json({ message: "Uploaded file not found" });
      }

      console.log("Calling Python API at:", `${PYTHON_API_URL}/predict`);

      const formData = new FormData();
      formData.append("image", fs.createReadStream(imagePath));

      console.log("Sending image to Python API...");
      const pythonResponse = await axios.post(
        `${PYTHON_API_URL}/predict`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 60000,
        }
      );

      console.log("Python API response:", pythonResponse.data);
      const result = pythonResponse.data;

      let recommendations = [];
      if (result.riskLevel === "low") {
        recommendations = [
          "Continue monitoring the patient's lesion for changes",
          "Recommend regular dermatological check-ups",
          "Advise patient on sun protection measures",
          "Document findings in patient's medical record",
        ];
      } else {
        recommendations = [
          "Refer patient to dermatologist immediately",
          "Schedule urgent dermatological consultation",
          "Advise patient to avoid sun exposure to the area",
          "Document high-risk findings in patient's medical record",
          "Consider biopsy evaluation",
        ];
      }

      const newScan = new Scan({
        user: req.user.id,
        patient: {
          name: patientName,
          age: Number.parseInt(patientAge),
          gender: patientGender,
        },

        imagePath: req.file.path.replace(/^server\//, ""),
        result: {
          prediction: result.prediction,
          riskLevel: result.riskLevel,
          confidence: result.confidence,
          details:
            result.details ||
            "Analysis based on visual characteristics of the lesion.",
        },
        recommendations,
      });

      await newScan.save();
      console.log("Scan saved to database:", newScan._id);

      res.status(200).json({
        scan: newScan,
        message: "Image analyzed successfully",
      });
    } catch (error) {
      console.error("Python API error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received from Python API");
      } else {
        console.error("Error message:", error.message);
      }

      return res.status(500).json({
        message: "Failed to analyze image. Python API is not available.",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res
      .status(500)
      .json({ message: "Failed to analyze image", error: error.message });
  }
};

export const getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ scans });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get scan history", error: error.message });
  }
};

export const getScanById = async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user.id });
    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }
    res.status(200).json({ scan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get scan details", error: error.message });
  }
};

export const deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user.id });
    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    if (scan.imagePath) {
      const fullPath = path.join(__dirname, "../../", scan.imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Scan.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Scan deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete scan", error: error.message });
  }
};
