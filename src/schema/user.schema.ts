import { z } from "zod";

const newUserSchema = z.object({
	name: z.string(),
	mobile: z.number(),
	email: z.string().email(),
	password: z.string(),
});

const updateUserSchema = newUserSchema.partial();

export { newUserSchema, updateUserSchema };
