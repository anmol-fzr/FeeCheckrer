import { z } from "zod";

const newCourseSchema = z.object({
  name: z.string(),
  deptId: z.string(),
  duration: z.number().gt(0).lt(7),
});

export { newCourseSchema };
