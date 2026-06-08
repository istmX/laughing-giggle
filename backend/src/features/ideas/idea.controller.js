import * as ideaService from "./idea.service.js";

export const createIdea = async (req, res, next) => {
    try {
        const idea = await ideaService.createIdea(req.user._id, req.body);

        return res.status(201).json({
            success: true,
            data: idea
        });

    } catch (error) {
        next(error);
    }
};

export const getIdeas = async (req, res, next) => {
    try {
        const ideas = await ideaService.getIdeas(req.user._id);

        return res.status(200).json({
            success: true,
            count: ideas.length,
            data: ideas
        });

    } catch (error) {
        next(error);
    }
};

export const getIdeaById = async (req, res, next) => {
    try {
        const idea = await ideaService.getIdeaById(req.user._id, req.params.id);

        return res.status(200).json({
            success: true,
            data: idea
        });

    } catch (error) {
        next(error);
    }
};

export const updateIdea = async (req, res, next) => {
    try {
        const idea = await ideaService.updateIdea(req.user._id, req.params.id, req.body);

        return res.status(200).json({
            success: true,
            data: idea
        });

    } catch (error) {
        next(error);
    }
};

export const deleteIdea = async (req, res, next) => {
    try {
        await ideaService.deleteIdea(req.user._id, req.params.id);

        return res.status(200).json({
            success: true,
            message: "Idea deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};