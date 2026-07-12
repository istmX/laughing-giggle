import mongoose from "mongoose";

const artifactSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    file_path: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      default: ""
    },
    file_type: {
      type: String,
      enum: ["markdown", "text", "json", "code"],
      default: "markdown"
    }
  },
  {
    timestamps: true
  }
);

// Ensure a project can only have one file with a specific path
artifactSchema.index({ project: 1, file_path: 1 }, { unique: true });

const Artifact = mongoose.model("Artifact", artifactSchema);

export default Artifact;
