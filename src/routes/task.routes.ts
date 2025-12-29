import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { authorizeAdmin } from "../middlewares/admin.middleware";
import { taskAccess } from "../middlewares/taskAccess.middleware";

import { validate } from "../middlewares/validate";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "../validators/task.schema";

import { createTask, getTasks, getTaskById, updateTask, updateTaskStatus, deleteTask } from "../controllers/task.controller";``

const router = Router();

router.get("/", protect, getTasks);
router.get("/:id", protect, taskAccess, getTaskById);
router.post("/", protect, authorizeAdmin, validate(createTaskSchema), createTask);
router.put("/status/:id", protect, taskAccess, validate(updateTaskStatusSchema), updateTaskStatus);
router.put("/:id", protect, authorizeAdmin, taskAccess, validate(updateTaskSchema), updateTask);
router.delete("/:id", protect, authorizeAdmin, taskAccess, deleteTask);

export default router;