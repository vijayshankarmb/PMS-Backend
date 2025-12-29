import { Response } from "express";
import Task from "../models/Task.model";
import Project from "../models/Project.model";
import { AuthRequest } from "../types/auth";

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ success: false });
        }

        const { taskName, taskDescription, projectId, assignedTo } = req.body;

        const project = await Project.findOne({
            _id: projectId,
            createdBy: req.user.userId
        });

        if (!project) {
            return res.status(403).json({ success: false });
        }

        const task = await Task.create({
            taskName,
            taskDescription,
            projectId,
            assignedTo,
            createdBy: req.user.userId
        });

        return res.status(201).json({ success: true, data: task });
    } catch {
        return res.status(500).json({ success: false });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role === "admin") {
            const tasks = await Task.find({ createdBy: req.user.userId })
                .populate("assignedTo", "name email")
                .populate("projectId", "projectName");

            return res.status(200).json({ success: true, data: tasks });
        }

        const tasks = await Task.find({ assignedTo: req.user?.userId })
            .populate("projectId", "projectName");

        return res.status(200).json({ success: true, data: tasks });
    } catch {
        return res.status(500).json({ success: false });
    }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("projectId", "projectName");

        if (!task) {
            return res.status(404).json({ success: false });
        }

        if (
            req.user?.role !== "admin" &&
            task.assignedTo.toString() !== req.user?.userId
        ) {
            return res.status(403).json({ success: false });
        }

        return res.status(200).json({ success: true, data: task });
    } catch {
        return res.status(400).json({ success: false });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ success: false });
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.userId },
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false });
        }

        return res.status(200).json({ success: true, data: task });
    } catch {
        return res.status(400).json({ success: false });
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false });
        }

        if (
            req.user?.role !== "admin" &&
            task.assignedTo.toString() !== req.user?.userId
        ) {
            return res.status(403).json({ success: false });
        }

        task.status = req.body.status;
        await task.save();

        return res.status(200).json({ success: true, data: task });
    } catch {
        return res.status(400).json({ success: false });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ success: false });
        }

        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!task) {
            return res.status(404).json({ success: false });
        }

        return res.status(200).json({ success: true });
    } catch {
        return res.status(400).json({ success: false });
    }
};
