import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  getAllUsers,
} from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../schema/authSchema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", getMe);
router.get("/users", getAllUsers);

export default router;
