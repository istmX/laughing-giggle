import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    project_title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    project_description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },

    project_status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;