import { AuthRequest } from "../types/auth";
import { Response, NextFunction } from "express";

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction)=>{
    if(req.user?.role !== 'admin'){
        return res.status(403).json({
            success: false,
            message: 'Forbidden, admin access required'
        });

    }
    next();
}