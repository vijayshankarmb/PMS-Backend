import { signup, login, logout, getMe } from "../controllers/auth.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

import { validate } from "../middlewares/validate";
import { signupSchema, loginSchema } from "../validators/auth.schema";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/logout", protect, logout);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);

export default router;