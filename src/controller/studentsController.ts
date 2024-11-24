/**
 * This Fill is Intended to be used by only Admin Panel Users not by student
 * For Student Side controller check `src/controller/student`
 * */

import { Factory } from "hono/factory";
import { Aggregate } from "mongoose";
import { Student } from "../model";
import { paginator } from "../middleware";
import { getAggrForPagintn } from "../utils";

const { createHandlers } = new Factory();

const getStudentsHndlr = createHandlers(paginator, async (c) => {
	const name = c.req.query("name");
	const id = c.req.query("id");
	const isVerified = c.req.query("isVerified");
	const email = c.req.query("email");
	const batchs = c.req.queries("batch");
	const completions = c.req.queries("completion");

	const { limit, skip } = c.get("paginator");

	const aggr = new Aggregate();

	if (id) {
		aggr.match({
			$expr: {
				$regexMatch: {
					input: { $toString: "$_id" },
					regex: id,
					options: "i",
				},
			},
		});
	}

	if (isVerified) {
		aggr.match({
			isVerified: isVerified === "true",
		});
	}

	if (completions && completions?.length === 1) {
		const forComplete = completions[0] === "true";
		aggr.match({
			details: {
				[forComplete ? "$ne" : "$eq"]: null,
			},
		});
	}

	if (name) {
		aggr.match({
			name: { $regex: name, $options: "i" },
		});
	}
	if (email) {
		aggr.match({
			email: { $regex: email, $options: "i" },
		});
	}

	if (batchs && batchs.length > 0) {
		const numBatch = batchs.map(Number);

		aggr.match({
			"details.batch": { $in: numBatch },
		});
	}

	const pipelineForCount = getAggrForPagintn(aggr);

	pipelineForCount.push({ $count: "total" });
	pipelineForCount.push({
		$unwind: {
			path: "$total",
			preserveNullAndEmptyArrays: true,
		},
	});

	aggr.skip(skip).limit(limit);

	aggr.sort({
		"details.createdAt": -1,
	});

	const pipeline = aggr.pipeline();
	const students = await Student.aggregate(pipeline);
	const total = await Student.aggregate(pipelineForCount);

	return c.json({
		paginate: total[0],
		data: students,
	});
});

const getStudentHndlr = createHandlers(async (c) => {
	const studentId = c.req.param("studentId");

	const aggr = new Aggregate();

	aggr.lookup({
		localField: "details",
		foreignField: "_id",
		from: "studentdetails",
		as: "profile",
	});

	aggr.unwind({
		path: "$profile",
		preserveNullAndEmptyArrays: true,
	});

	aggr.lookup({
		localField: "_id",
		foreignField: "studentId",
		from: "fees",
		as: "fees",
	});

	aggr.match({
		$expr: {
			$regexMatch: {
				input: { $toString: "$_id" },
				regex: studentId,
				options: "i",
			},
		},
	});

	const pipeline = aggr.pipeline();

	const student = await Student.aggregate(pipeline);

	return c.json({
		data: student[0],
	});
});

export { getStudentsHndlr, getStudentHndlr };
