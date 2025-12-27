import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { authorizeAdmin } from "../middlewares/admin.middleware";
import { taskAccess } from "../middlewares/taskAccess.middleware";

const router = Router();

router.get("/:id", protect, taskAccess);
router.post("/", protect, authorizeAdmin);
router.put("/:id", protect, taskAccess);
router.delete("/:id", protect, authorizeAdmin);

export default router;