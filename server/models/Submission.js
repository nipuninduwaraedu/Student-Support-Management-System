import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pdfUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
