import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { authorizeAdmin } from "../middlewares/admin.middleware";

import { validate } from "../middlewares/validate";
import { projectSchema, projectUpdateSchema } from "../validators/project.schema";

const router = Router();

router.get("/", protect, authorizeAdmin);
router.post("/", protect, authorizeAdmin, validate(projectSchema));
router.put("/:id", protect, authorizeAdmin, validate(projectUpdateSchema));
router.delete("/:id", protect, authorizeAdmin);

export default router;