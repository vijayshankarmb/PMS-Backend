import Project from "../models/Project.model";
import { Response } from "express";
import { AuthRequest } from "../types/auth";

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const { projectName, projectDescription } = req.body;

        const project = await Project.create({
            projectName,
            projectDescription,
            createdBy: req.user?.userId
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: 'Forbidden, admin access required'
            });
        }

        const projects = await Project.find({ createdBy: req.user?.userId })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');

        return res.status(200).json({
            success: true,
            message: 'Projects fetched successfully',
            data: projects
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export const getProjectById = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden, admin access required"
            });
        }

        const { id } = req.params;

        const project = await Project.findOne({
            _id: id,
            createdBy: req.user?.userId
        }).populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: project
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: 'Forbidden, admin access required'
            });
        }

        const { id } = req.params;

        const { projectName, projectDescription } = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: id, createdBy: req.user?.userId },
            {
                projectName,
                projectDescription
            },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: 'Forbidden, admin access required'
            });
        }

        const { id } = req.params;

        const project = await Project.findOneAndDelete({
            _id: id,
            createdBy: req.user?.userId
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}