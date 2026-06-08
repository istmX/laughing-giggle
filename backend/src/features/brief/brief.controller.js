import * as briefService from "./brief.service.js";

export const createBrief = async (req, res, next) => {
    try {
        const brief = await briefService.createBrief(req.user._id, req.body.idea);

        return res.status(201).json({
            success: true,
            data: brief
        });

    } catch (error) {
        next(error);
    }
};

export const getBriefs = async (req, res, next) => {
    try {
        const briefs = await briefService.getBriefs(req.user._id);

        return res.status(200).json({
            success: true,
            count: briefs.length,
            data: briefs
        });

    } catch (error) {
        next(error);
    }
};

export const getBriefById = async (req, res, next) => {
    try {
        const brief = await briefService.getBriefById(req.user._id, req.params.id);

        return res.status(200).json({
            success: true,
            data: brief
        });

    } catch (error) {
        next(error);
    }
};

export const updateBrief = async (req, res, next) => {
    try {
        const brief = await briefService.updateBrief(req.user._id, req.params.id, req.body);

        return res.status(200).json({
            success: true,
            data: brief
        });

    } catch (error) {
        next(error);
    }
};

export const deleteBrief = async (req, res, next) => {
    try {
        await briefService.deleteBrief(req.user._id, req.params.id);

        return res.status(200).json({
            success: true,
            message: "Brief deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};