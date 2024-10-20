import { z } from "zod";
import { numsOnly } from "../utils";

/*
 * Ensuring that ENV is added to server process
 * All Variable will be in string parse it here and use in the project
 * */

const envSchema = z.object({
  MONGO_URI: z.string().url(),
  PORT: z
    .string()
    .regex(numsOnly)
    .transform(Number)
    .refine((val) => val > 0 && val <= 65535, {
      message: "PORT must be a valid port number (0-65535)",
    }),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_TEMP_SECRET: z.string().min(1, "JWT_TEMP_SECRET is required"),
});

export { envSchema };
