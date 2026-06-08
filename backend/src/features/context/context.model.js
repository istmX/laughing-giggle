import mongoose from "mongoose";

const contextSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    idea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
      index: true,
    },

    project_overview: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    build_plan: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    architecture: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    mermaid_diagram: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    code_standards: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    library_docs: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    progress_tracker: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    ui_rules: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    ui_tokens: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    ui_registry: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    agents: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    readme: {
      type: String,
      default: "",
      maxlength: 10000,
    },
  },
  {
    timestamps: true,
  },
);

const Context = mongoose.model("Context", contextSchema);

export default Context;
