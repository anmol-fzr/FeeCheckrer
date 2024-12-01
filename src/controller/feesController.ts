import { Factory } from "hono/factory";
import { Aggregate } from "mongoose";
import { Fee } from "../model";
import { getAggrForPagintn } from "../utils";
import { zValidator } from "@hono/zod-validator";
import { searchFeeSchema, updateFeeSchema } from "../schema";
import { paginator } from "../middleware";
import { getFeeReceiptUri } from "@/helper";

const { createHandlers } = new Factory();

const getFeeHndlr = createHandlers(async (c) => {
	const feeId = c.req.param("feeId");

	const aggr = new Aggregate();

	aggr.match({
		$expr: {
			$regexMatch: {
				input: { $toString: "$_id" },
				regex: feeId,
				options: "i",
			},
		},
	});

	aggr.lookup({
		localField: "studentId",
		foreignField: "_id",
		from: "students",
		as: "student",
	});

	aggr.lookup({
		localField: "feeType",
		foreignField: "_id",
		from: "fee-types",
		as: "feetype",
	});

	aggr.unwind({
		path: "$feetype",
		preserveNullAndEmptyArrays: true,
	});

	aggr.unwind({
		path: "$student",
		preserveNullAndEmptyArrays: true,
	});

	const pipeline = aggr.pipeline();

	const fee = await Fee.aggregate(pipeline);
	if (fee.length === 0) {
		return c.json(
			{
				data: null,
				message: "Fee not Found",
			},
			404,
		);
	}

	const studentId = fee[0].studentId.toString();

	const pdfUri = await getFeeReceiptUri({ studentId, feeId });

	return c.json({
		data: {
			pdfUri,
			...fee[0],
		},
	});
});

const getFeesHndlr = createHandlers(
	paginator,
	zValidator("query", searchFeeSchema),
	async (c) => {
		const aggr = new Aggregate();
		const { name, status, sem, feeType } = c.req.valid("query");

		aggr
			.lookup({
				localField: "studentId",
				foreignField: "_id",
				from: "students",
				as: "student",
			})
			.unwind({
				path: "$student",
				preserveNullAndEmptyArrays: true,
			})
			.project({
				"student.createdAt": 0,
				"student.updatedAt": 0,
			});

		aggr.addFields({
			feeTypeId: {
				$cond: {
					if: {
						$regexMatch: { input: "$feeType", regex: /^[0-9a-fA-F]{24}$/ },
					},
					then: { $toObjectId: "$feeType" },
					else: null,
				},
			},
		});

		aggr.lookup({
			localField: "feeTypeId",
			foreignField: "_id",
			from: "fee-types",
			as: "feeType",
			pipeline: [
				{
					$match: {
						$expr: {
							$ne: ["$feeTypeId", null],
						},
					},
				},
			],
		});

		aggr
			.addFields({
				feeType: {
					$cond: {
						if: {
							$eq: ["$feeTypeId", null],
						},
						then: "Any Other",
						else: "$feeType.name",
					},
				},
			})
			.project({
				feeTypeId: 0,
			});

		aggr.unwind({
			path: "$feeTypeStr",
			preserveNullAndEmptyArrays: true,
		});

		aggr.unwind({
			path: "$feeType",
			preserveNullAndEmptyArrays: true,
		});

		if (name) {
			aggr.match({
				$expr: {
					$regexMatch: {
						input: { $toString: "$student.name" },
						regex: name,
						options: "i",
					},
				},
			});
		}

		if (feeType && feeType.length > 0) {
			aggr.match({
				feeType: { $in: feeType },
			});
		}

		if (status && status.length > 0) {
			aggr.match({
				status: { $in: status },
			});
		}

		if (sem && sem.length > 0) {
			const semNum = sem.map(Number);

			aggr.match({
				sem: { $in: semNum },
			});
		}

		aggr.sort({
			createdAt: -1,
		});

		const pipeline = aggr.pipeline();

		const pipelineForCount = getAggrForPagintn(aggr);

		pipelineForCount.push({ $count: "total" });
		pipelineForCount.push({
			$unwind: {
				path: "$total",
				preserveNullAndEmptyArrays: true,
			},
		});

		const fees = await Fee.aggregate(pipeline);
		const total = await Fee.aggregate(pipelineForCount);

		return c.json({
			data: fees,
			paginate: total[0],
		});
	},
);

const updateFeeHndlr = createHandlers(
	zValidator("json", updateFeeSchema),
	async (c) => {
		const feeId = c.req.param("feeId");
		const body = c.req.valid("json");

		const fee = await Fee.findByIdAndUpdate(feeId, body, { new: true });
		if (!fee) {
			return c.json(
				{
					data: null,
					message: "Fee not Found",
				},
				404,
			);
		}
		const updatedFee = fee.save();

		return c.json({
			data: updatedFee,
			message: "Fee Updated Successfully",
		});
	},
);

export { getFeeHndlr, getFeesHndlr, updateFeeHndlr };
