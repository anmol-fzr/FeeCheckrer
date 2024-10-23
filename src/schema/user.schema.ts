import { z } from "zod";

const newUserSchema = z.object({
  name: z.string(),
  mobile: z.number(),
  email: z.string().email(),
  deptId: z.string(),
  password: z.string(),
});

const updateUserSchema = newUserSchema.partial()

export { newUserSchema, updateUserSchema };
