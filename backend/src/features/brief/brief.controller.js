import mongoose from "mongoose";
import Brief from "./brief.model.js";
import Idea from "../ideas/idea.model.js";

export const createBrief = async (req, res) => {
    try {
        const { idea } = req.body;

        if (!idea) {
            return res.status(400).json({
                message: "Idea id is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(idea)) {
            return res.status(400).json({
                message: "Invalid idea id"
            });
        }

        const existingIdea = await Idea.findOne({
            _id: idea,
            owner: req.user._id
        });

        if (!existingIdea) {
            return res.status(404).json({
                message: "Idea not found"
            });
        }

        const existingBrief = await Brief.findOne({
            idea,
            owner: req.user._id
        });

        if (existingBrief) {
            return res.status(409).json({
                message: "Brief already exists for this idea"
            });
        }

        const brief = await Brief.create({
            owner: req.user._id,
            idea
        });

        return res.status(201).json({
            success: true,
            data: brief
        });

    } catch (error) {
        console.error("Error creating brief:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const getBriefs = async (req, res) => {
    try {
        const briefs = await Brief.find({
            owner: req.user._id
        })
        .populate({
            path: "idea",
            select: "prompt createdAt"
        })
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: briefs.length,
            data: briefs
        });

    } catch (error) {
        console.error("Error fetching briefs:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const getBriefById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid brief id"
            });
        }

        const brief = await Brief.findOne({
            _id: id,
            owner: req.user._id
        })
        .populate({
            path: "idea",
            select: "prompt createdAt"
        });

        if (!brief) {
            return res.status(404).json({
                message: "Brief not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: brief
        });

    } catch (error) {
        console.error("Error fetching brief:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const updateBrief = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid brief id"
            });
        }

        const brief = await Brief.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!brief) {
            return res.status(404).json({
                message: "Brief not found"
            });
        }

        const {
            application_type,
            target_users,
            platform,
            frontend_stack,
            backend_stack,
            database,
            ui_style,
            answers,
            missing_fields,
            is_complete,
            generated_by_ai
        } = req.body;

        if (application_type !== undefined)
            brief.application_type = application_type;

        if (target_users !== undefined)
            brief.target_users = target_users;

        if (platform !== undefined)
            brief.platform = platform;

        if (frontend_stack !== undefined)
            brief.frontend_stack = frontend_stack;

        if (backend_stack !== undefined)
            brief.backend_stack = backend_stack;

        if (database !== undefined)
            brief.database = database;

        if (ui_style !== undefined)
            brief.ui_style = ui_style;

        if (answers !== undefined)
            brief.answers = answers;

        if (missing_fields !== undefined)
            brief.missing_fields = missing_fields;

        if (is_complete !== undefined)
            brief.is_complete = is_complete;

        if (generated_by_ai !== undefined)
            brief.generated_by_ai = generated_by_ai;

        await brief.save();

        return res.status(200).json({
            success: true,
            data: brief
        });

    } catch (error) {
        console.error("Error updating brief:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const deleteBrief = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid brief id"
            });
        }

        const brief = await Brief.findOneAndDelete({
            _id: id,
            owner: req.user._id
        });

        if (!brief) {
            return res.status(404).json({
                message: "Brief not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brief deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting brief:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};