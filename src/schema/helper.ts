import { z } from "zod";

function isNumValid(val: number) {
	return !Number.isNaN(val);
}

const paginationSchema = z.object({
	page: z.coerce.number().optional(),
	size: z.coerce.number().optional(),
});

function createQueryParamSchema<T extends string>(arr: ReadonlyArray<T>) {
	const enumSchema = z.enum(arr as [T]);
	const schema = z
		.union([enumSchema, z.array(enumSchema)])
		.transform((val) => (typeof val === "string" ? [val] : val))
		.optional();

	return schema;
}

export { isNumValid, paginationSchema, createQueryParamSchema };
