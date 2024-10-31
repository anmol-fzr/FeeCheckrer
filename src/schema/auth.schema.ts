import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  otp: z.coerce.number().optional().nullable(),
});

const signUpSchema = loginSchema;

const updateAccountSchema = loginSchema.pick({ password: true });

export { loginSchema, signUpSchema, updateAccountSchema };
