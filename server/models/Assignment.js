import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    module: { type: String, required: true },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", AssignmentSchema);
