import { AuthRequest } from "../types/auth";
import { Response, NextFunction } from "express";
import Task from "../models/Task.model";

export const taskAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        if (req.user?.role === 'admin') {
            return next();
        }

        if (task.assignedTo.toString() === req.user?.userId) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'Forbidden, not authorized to access this task'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}