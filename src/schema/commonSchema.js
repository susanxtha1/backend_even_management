import { z } from "zod";

export const uuidParamSchema = z.object({
  id: z.string({ required_error: "ID is required" }).uuid("Invalid UUID format"),
});
