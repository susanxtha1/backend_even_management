import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { validate, validateParams } from "../middleware/validate.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createEventSchema, updateEventSchema } from "../schema/eventSchema.js";
import { uuidParamSchema } from "../schema/commonSchema.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", validateParams(uuidParamSchema), getEventById);

// Protected routes — ORGANIZER & ADMIN
router.post(
  "/",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  validate(createEventSchema),
  createEvent,
);

router.put(
  "/:id",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  validateParams(uuidParamSchema),
  validate(updateEventSchema),
  updateEvent,
);

router.delete(
  "/:id",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  validateParams(uuidParamSchema),
  deleteEvent,
);

export default router;
