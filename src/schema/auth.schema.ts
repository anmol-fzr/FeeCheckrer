import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

//const validNum = () => {
//
//}
//  .refine(val => {
//    return !Number.isNaN(val)
//  },{message: "Invalid Mobile Number"}),

const isNumValid = (val: number) => {
  return !Number.isNaN(val);
};

const stuOnboardSchema = z.object({
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

const signUpSchema = loginSchema;

export { loginSchema, signUpSchema, stuOnboardSchema };
