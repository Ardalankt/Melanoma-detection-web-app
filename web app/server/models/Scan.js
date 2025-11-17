import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      age: {
        type: Number,
        required: true,
        min: 0,
        max: 150,
      },
      gender: {
        type: String,
        required: true,
        enum: ["male", "female"],
      },
    },
    imagePath: {
      type: String,
      required: true,
    },
    result: {
      prediction: {
        type: String,
        enum: ["Benign", "Melanoma"],
        required: true,
      },
      confidence: {
        type: Number,
        min: 0,
        max: 100,
      },
      riskLevel: {
        type: String,
        enum: ["low", "high"],
        required: true,
      },
      details: {
        type: String,
        default: "",
      },
    },
    recommendations: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Scan = mongoose.model("Scan", ScanSchema);
export default Scan;
