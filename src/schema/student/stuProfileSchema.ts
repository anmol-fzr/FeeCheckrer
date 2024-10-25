import { z } from "zod";
import { isNumValid } from "../helper";

const stuNewProfileSchema = z.object({
  name: z.string(),
  mobile: z
    .string()
    .min(10)
    .max(10)
    .transform(Number)
    .refine(isNumValid, { message: "Invalid Mobile Number" }),
  admissionNo: z
    .string()
    .min(4)
    .max(8)
    .transform(Number)
    .refine(isNumValid, { message: "Invalid Admission Number" }),
  rollNo: z
    .string()
    .min(4)
    .max(8)
    .transform(Number)
    .refine(isNumValid, { message: "Invalid Roll Number" }),
  batch: z
    .string()
    .min(4)
    .max(4)
    .transform(Number)
    .refine(isNumValid, { message: "Invalid Batch Year" }),
});

const stuProfileUpdateSchema = stuNewProfileSchema.partial();

export { stuNewProfileSchema, stuProfileUpdateSchema };
