import express from "express";
import {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venueController.js";
import { validate, validateParams } from "../middleware/validate.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createVenueSchema, updateVenueSchema } from "../schema/venueSchema.js";
import { uuidParamSchema } from "../schema/commonSchema.js";

const router = express.Router();

// Public routes
router.get("/", getVenues);
router.get("/:id", validateParams(uuidParamSchema), getVenueById);

// Protected routes — ADMIN & ORGANIZER
router.post(
  "/",
  protect,
  authorize("ADMIN", "ORGANIZER"),
  validate(createVenueSchema),
  createVenue
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "ORGANIZER"),
  validateParams(uuidParamSchema),
  validate(updateVenueSchema),
  updateVenue
);

// Protected routes — ADMIN only
router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  validateParams(uuidParamSchema),
  deleteVenue
);

export default router;
