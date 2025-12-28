import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { authorizeAdmin } from "../middlewares/admin.middleware";

import { validate } from "../middlewares/validate";
import { projectSchema, projectUpdateSchema } from "../validators/project.schema";

import { createProject, updateProject, getProjects, getProjectById, deleteProject } from "../controllers/project.controller";

const router = Router();

router.get("/", protect, authorizeAdmin, getProjects);
router.get("/:id", protect, authorizeAdmin, getProjectById);
router.post("/", protect, authorizeAdmin, validate(projectSchema), createProject);
router.put("/:id", protect, authorizeAdmin, validate(projectUpdateSchema), updateProject);
router.delete("/:id", protect, authorizeAdmin, deleteProject);

export default router;