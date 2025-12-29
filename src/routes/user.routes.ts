import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { authorizeAdmin } from "../middlewares/admin.middleware";
import { getAllUsers } from "../controllers/user.controller";

const router = Router();

router.get("/", protect, authorizeAdmin, getAllUsers);

export default router;
