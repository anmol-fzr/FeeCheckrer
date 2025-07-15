import { z } from "zod";
import { isNumValid } from "../helper";

function createClampedNumSchema(message: string, minChars: number) {
	const maxChars = minChars;
	const schema = z
		.string()
		.min(minChars)
		.max(maxChars)
		.transform(Number)
		.refine(isNumValid, { message });

	return schema;
}

const stuNewProfileSchema = z.object({
	name: z.string(),
	mobile: createClampedNumSchema("Invalid Mobile Number", 10),
	admissionNo: createClampedNumSchema("Invalid Admission Number", 8),
	rollNo: createClampedNumSchema("Invalid Roll Number", 6),
	batch: createClampedNumSchema("Invalid Batch Number", 4),
});

const stuProfileUpdateSchema = stuNewProfileSchema.partial();

export { stuNewProfileSchema, stuProfileUpdateSchema };
