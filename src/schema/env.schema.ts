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
	MODE: z.enum(["DEV", "PROD"]).default("DEV"),

	MONGO_URI: z.string().url(),

	REDIS_HOST: z.string(),
	REDIS_PORT: portSchema("REDIS_PORT"),

	AMQP_URI: z.string().url(),
	PORT: portSchema("PORT"),

	JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

	MINIO_HOST: z.union([z.string().ip(), z.enum(["localhost"])]),
	MINIO_PORT: portSchema("MINIO_PORT"),
	MINIO_ACCESS_KEY: z.string(),
	MINIO_SECRET_KEY: z.string(),

	SUPERADMIN_NAME: z.string(),
	SUPERADMIN_MOBILE: z.coerce.number().transform(Number),
	SUPERADMIN_EMAIL: z.string().email(),
	SUPERADMIN_PASSWORD: z.string().min(5),
});

export { envSchema };
