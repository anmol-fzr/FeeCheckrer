import { z } from "zod";

const isNumValid = (val: number) => {
  return !Number.isNaN(val);
};

const paginationSchema = z.object({
  page: z.coerce.number().optional(),
  size: z.coerce.number().optional(),
});

export { isNumValid, paginationSchema };
