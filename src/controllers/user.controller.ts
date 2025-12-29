// controllers/user.controller.ts
import { Response } from "express";
import User from "../models/User.model";
import { AuthRequest } from "../types/auth";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    const users = await User.find()
        .select("_id name email role")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        data: users
    });
};
