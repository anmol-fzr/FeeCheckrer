import { FeeType } from "@/model";
import { feeTypeSchema } from "@/schema";
import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { Aggregate } from "mongoose";

const { createHandlers } = createFactory();

const getFeeTypeHndlr = createHandlers(async (c) => {
	const aggr = new Aggregate();

	aggr.addFields({
		label: "$name",
		value: "$_id",
	});

	aggr.project({
		_id: 0,
		name: 0,
		createdAt: 0,
		updatedAt: 0,
	});

	const pipeline = aggr.pipeline();
	const feeTypes = await FeeType.aggregate(pipeline);

	feeTypes.push({
		label: "Any Other",
		value: "any_other",
	});

	return c.json({
		data: feeTypes,
	});
});

const createFeeTypeHndlr = createHandlers(
	zValidator("json", feeTypeSchema),
	async (c) => {
		const { name } = c.req.valid("json");

		const feeType = new FeeType({ name });
		const savedFeeType = await feeType.save();

		return c.json({
			data: savedFeeType,
		});
	},
);

export { getFeeTypeHndlr, createFeeTypeHndlr };
