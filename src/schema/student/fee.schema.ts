import { z } from "zod";
import { sbCollectRegex } from "@/utils";
import { feeStatuses, feeTypes } from "@/model";
import { paginationSchema, createQueryParamSchema } from "@/schema/helper";
import { sems } from "@/utils";

function feeAmntSchema(label: string) {
	const schema = z.coerce
		.number({
			invalid_type_error: `${label} must be a number`,
		})
		.safe()
		.max(999999);

	return schema;
}

const addFeeSchema = z
	.object({
		sbCollRef: z
			.string()
			.regex(sbCollectRegex, "Invalid SB Collect Reference Number"),
		amount: feeAmntSchema("Amount").positive("Amount must be greater than 0"),
		sem: z.string({ message: "Semester is Required" }),
		feeType: z.string({ message: "Fee Type is Required" }),
		otherFeeType: z.string().optional(),
		hostelFeeAmount: feeAmntSchema("Hostel Fee Amount"),
		securityAmount: feeAmntSchema("Security Fee Amount"),
		fineAmount: feeAmntSchema("Fine Amount"),
	})
	.superRefine(({ otherFeeType, feeType }, refinementContext) => {
		if (feeType === "Any Other" && !otherFeeType) {
			refinementContext.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Specify Fee Type Here",
				path: ["otherFeeType"],
			});
		}
	});

const updateFeeSchema = z.object({
	status: z.enum(feeStatuses),
	rejection: z.string().optional(),
});

const searchFeeSchema = z
	.object({
		feeType: createQueryParamSchema(feeTypes),
		status: createQueryParamSchema(feeStatuses),
		sem: createQueryParamSchema(sems),
	})
	.and(paginationSchema);

export { addFeeSchema, updateFeeSchema, searchFeeSchema };
