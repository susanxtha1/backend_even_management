import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { validate, validateParams } from "../middleware/validate.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schema/categorySchema.js";
import { uuidParamSchema } from "../schema/commonSchema.js";

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/:id", validateParams(uuidParamSchema), getCategoryById);

// Protected routes — ADMIN ONLY
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  validate(createCategorySchema),
  createCategory,
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  validateParams(uuidParamSchema),
  validate(updateCategorySchema),
  updateCategory,
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  validateParams(uuidParamSchema),
  deleteCategory,
);

export default router;
