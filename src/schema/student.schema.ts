import { z } from "zod";
import {
  atLeastOneLowerCase,
  atLeastOneNum,
  atLeastOneUpperCase,
} from "../utils";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be of atleast 8 characters" })
  .max(20, { message: "Password must be of atmost 20 characters" })
  .refine((password) => atLeastOneUpperCase.test(password), {
    message: "Password must contain atleast 1 Uppercase character",
  })
  .refine((password) => atLeastOneLowerCase.test(password), {
    message: "Password must contain atleast 1 Lowercase character",
  })
  .refine((password) => atLeastOneNum.test(password), {
    message: "Password must contain atleast 1 number",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message:
      "Password must contain atleast on of these special characters !@#$%^&*",
  });

const stuLoginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  //confirmPassword: passwordSchema,
});
//.refine((values) => values.password === values.confirmPassword, {
//  message: "Passwords must match!",
//  path: ["confirmPassword"],
//});

export { stuLoginSchema, registerSchema };
