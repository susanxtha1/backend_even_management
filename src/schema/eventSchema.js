import { z } from "zod";

export const createEventSchema = z
  .object({
    categoryId: z
      .string({ required_error: "Category ID is required" })
      .uuid("Category ID must be a valid UUID"),
    venueId: z
      .string({ required_error: "Venue ID is required" })
      .uuid("Venue ID must be a valid UUID"),
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title cannot exceed 200 characters"),
    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters")
      .optional()
      .nullable(),
    startTime: z
      .string({ required_error: "Start time is required" })
      .datetime({ message: "Start time must be a valid ISO 8601 datetime" }),
    endTime: z
      .string({ required_error: "End time is required" })
      .datetime({ message: "End time must be a valid ISO 8601 datetime" }),
    status: z
      .enum(["published", "draft", "cancelled"], {
        invalid_type_error: "Status must be published, draft, or cancelled",
      })
      .default("published"),
  })
  .refine((data) => new Date(data.startTime) > new Date(), {
    message: "Start time must be in the future",
    path: ["startTime"],
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const updateEventSchema = z
  .object({
    categoryId: z.string().uuid("Category ID must be a valid UUID").optional(),
    venueId: z.string().uuid("Venue ID must be a valid UUID").optional(),
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title cannot exceed 200 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters")
      .optional()
      .nullable(),
    startTime: z
      .string()
      .datetime({ message: "Start time must be a valid ISO 8601 datetime" })
      .optional(),
    endTime: z
      .string()
      .datetime({ message: "End time must be a valid ISO 8601 datetime" })
      .optional(),
    status: z
      .enum(["published", "draft", "cancelled"], {
        invalid_type_error: "Status must be published, draft, or cancelled",
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  })
  .refine(
    (data) => {
      // If both dates are provided, endTime must be after startTime
      if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );
