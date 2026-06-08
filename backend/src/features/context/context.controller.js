import * as contextService from "./context.service.js";

export const createContext = async (req, res, next) => {
  try {
    const context = await contextService.createContext(req.user._id, req.body.idea);

    return res.status(201).json({
      success: true,
      data: context,
    });
  } catch (error) {
    next(error);
  }
};

export const getContexts = async (req, res, next) => {
  try {
    const contexts = await contextService.getContexts(req.user._id);

    return res.status(200).json({
      success: true,
      count: contexts.length,
      data: contexts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContextById = async (req, res, next) => {
  try {
    const context = await contextService.getContextById(req.user._id, req.params.id);

    return res.status(200).json({
      success: true,
      data: context,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContext = async (req, res, next) => {
  try {
    const context = await contextService.updateContext(req.user._id, req.params.id, req.body);

    return res.status(200).json({
      success: true,
      data: context,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContext = async (req, res, next) => {
  try {
    await contextService.deleteContext(req.user._id, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Context deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
