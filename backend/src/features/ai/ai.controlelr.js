import mongoose from "mongoose";

import Idea from "../ideas/idea.model.js";
import Brief from "../brief/brief.model.js";

export const analyzeIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ideaId)) {
      return res.status(400).json({
        message: "Invalid idea id"
      });
    }

    const idea = await Idea.findOne({
      _id: ideaId,
      owner: req.user._id
    });

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found"
      });
    }

    const brief = await Brief.findOne({
      idea: idea._id,
      owner: req.user._id
    });

    if (!brief) {
      return res.status(404).json({
        message: "Brief not found"
      });
    }

   

    return res.status(200).json({
      success: true,
      message: "Ready for AI analysis",
      idea,
      brief
    });

  } catch (error) {
    console.error("Error analyzing idea:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};