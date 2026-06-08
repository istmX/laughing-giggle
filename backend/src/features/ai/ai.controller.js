import mongoose from "mongoose";

import Idea from "../ideas/idea.model.js";
import Brief from "../brief/brief.model.js";

const getIdeaAndBrief = async (ideaId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(ideaId)) {
    return { error: { status: 400, message: "Invalid idea id" } };
  }

  const idea = await Idea.findOne({
    _id: ideaId,
    owner: userId,
  });

  if (!idea) {
    return { error: { status: 404, message: "Idea not found" } };
  }

  const brief = await Brief.findOne({
    idea: idea._id,
    owner: userId,
  });

  if (!brief) {
    return { error: { status: 404, message: "Brief not found" } };
  }

  return { idea, brief };
};

export const analyzeIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { idea, brief, error } = await getIdeaAndBrief(ideaId, req.user._id);

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "Ready for AI analysis",
      idea,
      brief,
    });
  } catch (error) {
    console.error("Error analyzing idea:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { idea, brief, error } = await getIdeaAndBrief(ideaId, req.user._id);

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json({
      success: true,
      idea,
      brief,
      message: "Ready for question generation",
    });
  } catch (error) {
    console.error("Error generating questions:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


export const submitAnswers = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { answers } = req.body;

    const { idea, brief, error } = await getIdeaAndBrief(
      ideaId,
      req.user._id
    );

    if (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    brief.answers = {
      ...brief.answers,
      ...answers,
    };

    await brief.save();

    return res.status(200).json({
      success: true,
      message: "Answers saved successfully",
      brief,
    });
  } catch (error) {
    console.error("Error saving answers:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};



export const generateContext = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const { idea, brief, error } = await getIdeaAndBrief(
      ideaId,
      req.user._id
    );

    if (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }

    if (!brief.is_complete) {
      return res.status(400).json({
        message: "Brief is not complete",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ready for context generation",
      idea,
      brief,
    });
  } catch (error) {
    console.error("Error generating context:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};