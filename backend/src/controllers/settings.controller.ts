import {Request, Response} from "express";
import {
    getAppSettings,
    updateAppSettings
} from "../services/setting.services";

export const getSettings = (req: Request, res: Response) => {
    try {
        const settings = getAppSettings();
        return res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch settings."
        });
    }
};

export const updateSettings = (req: Request, res: Response) => {
    try {
        const updates = req.body;
        const updatedSettings = updateAppSettings(updates);
        return res.status(200).json({
            success: true,
            data: updatedSettings
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update settings."
        });
    }
};
