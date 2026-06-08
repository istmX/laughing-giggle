import mongoose from "mongoose";

const briefSchema = new mongoose.Schema(
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

    application_type: {
      type: String,
      default: null,
      maxlength: 500
    },

    target_users: {
      type: String,
      default: null,
      maxlength: 500
    },

    platform: {
      type: String,
      enum: [
        "web",
        "mobile",
        "desktop",
        "cross-platform",
        "ai-decide"
      ],
      default: "ai-decide"
    },

    frontend_stack: {
      type: String,
      enum: [
        "react",
        "nextjs",
        "react-native",
        "ai-decide"
      ],
      default: "ai-decide"
    },

    backend_stack: {
      type: String,
      enum: [
        "mern",
        "pern",
        "next-fullstack",
        "ai-decide"
      ],
      default: "ai-decide"
    },

    database: {
      type: String,
      enum: [
        "mongodb",
        "postgresql",
        "supabase",
        "ai-decide"
      ],
      default: "ai-decide"
    },

    ui_style: {
      type: String,
      enum: [
        "modern",
        "minimal",
        "glassmorphism",
        "corporate",
        "ai-decide"
      ],
      default: "ai-decide"
    },

    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    missing_fields: {
      type: [String],
      default: []
    },

    is_complete: {
      type: Boolean,
      default: false
    },

    generated_by_ai: {
      type: Boolean,
      default: false
    },

    questions: [
      {
        key: { type: String, required: true },
        question: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "answered"],
          default: "pending",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true
  }
);

briefSchema.index({ idea: 1, owner: 1 }, { unique: true });

const Brief = mongoose.model("Brief", briefSchema);

export default Brief;
