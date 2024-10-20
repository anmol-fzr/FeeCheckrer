import { z } from "zod";

const newUserSchema = z.object({
  name: z.string(),
  mobile: z.number(),
  email: z.string().email(),
  deptId: z.string(),
  password: z.string(),
});

const updateUserSchema = newUserSchema
  .pick({
    name: true,
    mobile: true,
    email: true,
  })
  .merge(newUserSchema.pick({ password: true }).partial());

export { newUserSchema, updateUserSchema };
