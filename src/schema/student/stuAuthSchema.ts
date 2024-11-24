import { z } from "zod";
import { stuNewProfileSchema } from "./stuProfileSchema";

const stuLoginSchema = z.object({
	email: z.string().email(),
	otp: z.coerce.number().optional().nullable(),
});

const registerSchema = z
	.object({
		email: z.string().email(),
		avatar: z.string().optional(),
	})
	.and(stuNewProfileSchema);

export { stuLoginSchema, registerSchema };
