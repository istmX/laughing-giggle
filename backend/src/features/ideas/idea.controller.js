import mongoose from "mongoose";
import Idea from "./idea.model.js";

export const createIdea = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                message: "Idea prompt is required"
            });
        }

        const idea = await Idea.create({
            owner: req.user._id,
            prompt
        });

        return res.status(201).json({
            success: true,
            data: idea
        });

    } catch (error) {
        console.error("Error creating idea:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const getIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: ideas.length,
            data: ideas
        });

    } catch (error) {
        console.error("Error fetching ideas:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const getIdeaById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid idea id"
            });
        }

        const idea = await Idea.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!idea) {
            return res.status(404).json({
                message: "Idea not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: idea
        });

    } catch (error) {
        console.error("Error fetching idea:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const updateIdea = async (req, res) => {
    try {
        const { id } = req.params;
        const { prompt, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid idea id"
            });
        }

        const idea = await Idea.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!idea) {
            return res.status(404).json({
                message: "Idea not found"
            });
        }

        if (prompt) idea.prompt = prompt;
        if (status) idea.status = status;

        await idea.save();

        return res.status(200).json({
            success: true,
            data: idea
        });

    } catch (error) {
        console.error("Error updating idea:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const deleteIdea = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid idea id"
            });
        }

        const idea = await Idea.findOneAndDelete({
            _id: id,
            owner: req.user._id
        });

        if (!idea) {
            return res.status(404).json({
                message: "Idea not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Idea deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting idea:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};