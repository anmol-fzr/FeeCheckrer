import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

const updateAccountSchema = loginSchema.pick({ password: true });

export { loginSchema, updateAccountSchema };
