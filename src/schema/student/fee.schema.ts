import { z } from "zod";
import { sbCollectRegex } from "../../utils";
import { feeStatuses, feeTypes } from "../../model";
import { paginationSchema } from "../helper";

const feeAmntSchema = (label: string) =>
  z
    .number({
      invalid_type_error: `${label} must be a number`,
    })
    .safe()
    .max(999999);

const boolSchema = (label: string) =>
  z.enum(["true", "false"], {
    errorMap: () => ({ message: `${label} is Required` }),
  });

const addFeeSchema = z
  .object({
    sbCollRef: z
      .string()
      .regex(sbCollectRegex, "Invalid SB Collect Reference Number"),
    amount: feeAmntSchema("Amount").positive("Amount must be greater than 0"),
    sem: z.string({ message: "Semester is Required" }),
    feeType: z.string({ message: "Fee Type is Required" }),
    haveHostelFee: boolSchema("Hostel Fee"),
    hostelFeeAmount: feeAmntSchema("Hostel Fee Amount"),
    securityAmount: feeAmntSchema("Security Fee Amount"),
    fineAmount: feeAmntSchema("Fine Amount"),
  })
  .superRefine(({ haveHostelFee, hostelFeeAmount }, refinementContext) => {
    if (haveHostelFee === "true" && hostelFeeAmount === undefined) {
      refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hostel Fee Amount is required",
        path: ["hostelFee"],
      });
    }
  });

const updateFeeSchema = z.object({
  status: z.enum(feeStatuses),
  rejection: z.string().optional()
});

const sems = Array.from({ length: 8 }, (_, i) => `${i + 1}`);

const queryParamSchema = (arr: any) =>
  z
    .union([z.enum(arr), z.array(z.enum(arr))])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .optional();

const searchFeeSchema = z
  .object({
    feeType: queryParamSchema(feeTypes),
    status: queryParamSchema(feeStatuses),
    sem: queryParamSchema(sems),
  })
  .and(paginationSchema);

export { addFeeSchema, updateFeeSchema, searchFeeSchema };
