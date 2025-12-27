import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../types/auth";

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized, token is missing" });
    }

    try {
        const decoded = verifyToken(token);
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}