import { z } from "zod";

const newDeptSchema = z.object({
  name: z.string(),
});

const updateDeptSchema = newDeptSchema;

export { newDeptSchema, updateDeptSchema };
