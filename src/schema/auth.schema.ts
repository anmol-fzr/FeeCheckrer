import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signUpSchema = loginSchema;

const updateAccountSchema = loginSchema.pick({ password: true });

export { loginSchema, signUpSchema, updateAccountSchema };
