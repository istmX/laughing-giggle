import * as aiService from "../ai.service.js";

export const analyzeIdea = async (req, res, next) => {
  try {
    const result = await aiService.analyzeIdea(req.user._id, req.params.ideaId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const generateQuestions = async (req, res, next) => {
  try {
    const { idea, brief } = await aiService.getIdeaAndBrief(req.user._id, req.params.ideaId);

    return res.status(200).json({
      success: true,
      idea,
      brief,
      message: "Ready for question generation",
    });
  } catch (error) {
    next(error);
  }
};


export const submitAnswers = async (req, res, next) => {
  try {
    const brief = await aiService.submitAnswers(req.user._id, req.params.ideaId, req.body.answers);

    return res.status(200).json({
      success: true,
      message: "Answers saved successfully",
      brief,
    });
  } catch (error) {
    next(error);
  }
};



export const generateContext = async (req, res, next) => {
  try {
    const context = await aiService.generateContext(req.user._id, req.params.ideaId);

    return res.status(200).json({
      success: true,
      message: "Context generated successfully",
      data: context,
    });
  } catch (error) {
    next(error);
  }
};

export const generateTasks = async (req, res, next) => {
  try {
    const result = await aiService.generateTasks(req.user._id, req.params.ideaId);

    return res.status(200).json({
      success: true,
      message: "Tasks generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};