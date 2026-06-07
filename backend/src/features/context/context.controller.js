import mongoose from "mongoose";
import Context from "./context.model.js";
import Idea from "../ideas/idea.model.js";
import Project from "../projects/project.model.js";

export const createContext = async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({
        message: "Idea id is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(idea)) {
      return res.status(400).json({
        message: "Invalid idea id",
      });
    }

    const existingIdea = await Idea.findOne({
      _id: idea,
      owner: req.user._id,
    });

    if (!existingIdea) {
      return res.status(404).json({
        message: "Idea not found or you do not have permission",
      });
    }

    const context = await Context.create({
      owner: req.user._id,
      idea,
    });

    return res.status(201).json({
      success: true,
      data: context,
    });
  } catch (error) {
    console.error("Error creating context:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid data format",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getContexts = async (req, res) => {
  try {
    const contexts = await Context.find({
      owner: req.user._id,
    })
      .populate("idea")
      .populate("project")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contexts.length,
      data: contexts,
    });
  } catch (error) {
    console.error("Error fetching contexts:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getContextById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid context id",
      });
    }

    const context = await Context.findOne({
      _id: id,
      owner: req.user._id,
    })
      .populate("idea")
      .populate("project");

    if (!context) {
      return res.status(404).json({
        message: "Context not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: context,
    });
  } catch (error) {
    console.error("Error fetching context:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateContext = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid context id",
      });
    }

    const context = await Context.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!context) {
      return res.status(404).json({
        message: "Context not found",
      });
    }

    const {
      project,
      project_overview,
      build_plan,
      architecture,
      code_standards,
      library_docs,
      progress_tracker,
      ui_rules,
      ui_tokens,
      ui_registry,
      agents,
      readme,
    } = req.body;

    if (project !== undefined) {
      if (project !== null) {
        if (!mongoose.Types.ObjectId.isValid(project)) {
          return res.status(400).json({
            message: "Invalid project id",
          });
        }

        const existingProject = await Project.findOne({
          _id: project,
          owner: req.user._id,
        });

        if (!existingProject) {
          return res.status(404).json({
            message: "Project not found or you do not have permission",
          });
        }
        context.project = existingProject._id;
      } else {
        context.project = null;
      }
    }

    if (project_overview !== undefined) context.project_overview = project_overview;

    if (build_plan !== undefined) context.build_plan = build_plan;

    if (architecture !== undefined) context.architecture = architecture;

    if (code_standards !== undefined) context.code_standards = code_standards;

    if (library_docs !== undefined) context.library_docs = library_docs;

    if (progress_tracker !== undefined) context.progress_tracker = progress_tracker;

    if (ui_rules !== undefined) context.ui_rules = ui_rules;

    if (ui_tokens !== undefined) context.ui_tokens = ui_tokens;

    if (ui_registry !== undefined) context.ui_registry = ui_registry;

    if (agents !== undefined) context.agents = agents;

    if (readme !== undefined) context.readme = readme;

    await context.save();

    return res.status(200).json({
      success: true,
      data: context,
    });
  } catch (error) {
    console.error("Error updating context:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteContext = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid context id",
      });
    }

    const context = await Context.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!context) {
      return res.status(404).json({
        message: "Context not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Context deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting context:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
