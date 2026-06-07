import mongoose from "mongoose";

const aiGenerationSchema = new mongoose.Schema(
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
      index: true,
    },

    context: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Context",
      default: null,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },

    generated_context: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Context",
      default: null,
    },

    generated_project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    model: {
      type: String,
      default: "gemini-2.5-flash",
    },

    generation_hash: {
      type: String,
      required: true,
      index: true,
    },

    prompt_version: {
      type: String,
      default: "v1",
    },

    prompt_tokens: {
      type: Number,
      default: 0,
    },

    completion_tokens: {
      type: Number,
      default: 0,
    },

    total_tokens: {
      type: Number,
      default: 0,
    },

    generation_time_ms: {
      type: Number,
      default: 0,
    },

    error_message: {
      type: String,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

aiGenerationSchema.index({
  owner: 1,
  idea: 1,
});

const AIGeneration = mongoose.model("AIGeneration", aiGenerationSchema);

export default AIGeneration;
