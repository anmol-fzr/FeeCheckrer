import { z } from "zod";
import { numsOnly } from "../utils";

const isValidPort = (port: number) => port > 0 && port <= 65535;

const portSchema = (label: string) =>
  z
    .string()
    .regex(numsOnly)
    .transform(Number)
    .refine(isValidPort, {
      message: `${label} must be a valid port number (0-65535)`,
    });

/*
 * Ensuring that ENV is added to server process
 * All Variable will be in string parse it here and use in the project
 * */

const envSchema = z.object({
  MONGO_URI: z.string().url(),

  REDIS_HOST: z.string(),
  REDIS_PORT: portSchema("REDIS_PORT"),

  AMQP_URI: z.string().url(),
  PORT: portSchema("PORT"),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_TEMP_SECRET: z.string().min(1, "JWT_TEMP_SECRET is required"),
});

export { envSchema };
