import mongoose from "mongoose";

const contextSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    idea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },

    project_overview: {
      type: String,
      default: ""
    },

    build_plan: {
      type: String,
      default: ""
    },

    architecture: {
      type: String,
      default: ""
    },

    code_standards: {
      type: String,
      default: ""
    },

    library_docs: {
      type: String,
      default: ""
    },

    progress_tracker: {
      type: String,
      default: ""
    },

    ui_rules: {
      type: String,
      default: ""
    },

    ui_tokens: {
      type: String,
      default: ""
    },

    ui_registry: {
      type: String,
      default: ""
    },

    agents: {
      type: String,
      default: ""
    },

    readme: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Context = mongoose.model("Context", contextSchema);

export default Context;