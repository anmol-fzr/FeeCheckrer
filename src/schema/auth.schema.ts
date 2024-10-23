import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signUpSchema = loginSchema

export { loginSchema, signUpSchema };
