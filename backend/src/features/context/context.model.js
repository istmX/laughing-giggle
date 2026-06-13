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
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    build_plan: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    architecture: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    mermaid_diagram: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    code_standards: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    library_docs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    progress_tracker: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    ui_rules: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    ui_tokens: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    ui_registry: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    agents: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    readme: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const Context = mongoose.model("Context", contextSchema);

export default Context;
