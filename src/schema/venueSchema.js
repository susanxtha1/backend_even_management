import { z } from "zod";

export const createVenueSchema = z.object({
  name: z
    .string({ required_error: "Venue name is required" })
    .trim()
    .min(2, "Venue name must be at least 2 characters")
    .max(150, "Venue name cannot exceed 150 characters"),
  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters"),
  capacity: z
    .number({ required_error: "Capacity is required", invalid_type_error: "Capacity must be a number" })
    .int("Capacity must be a whole number")
    .positive("Capacity must be a positive number"),
});

export const updateVenueSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Venue name must be at least 2 characters")
      .max(150, "Venue name cannot exceed 150 characters")
      .optional(),
    address: z
      .string()
      .trim()
      .min(5, "Address must be at least 5 characters")
      .optional(),
    capacity: z
      .number({ invalid_type_error: "Capacity must be a number" })
      .int("Capacity must be a whole number")
      .positive("Capacity must be a positive number")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
