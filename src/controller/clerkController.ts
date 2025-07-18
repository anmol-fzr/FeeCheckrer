import { createFactory } from "hono/factory";
import { newUserSchema, updateUserSchema } from "@/schema";
import { zValidator } from "@hono/zod-validator";
import { User } from "@/model";
import mongoose, { Aggregate } from "mongoose";
import { paginator } from "@/middleware";
import { badReq, serverError } from "@/helper";
import { serve } from "bun";

const ObjectId = mongoose.Types.ObjectId;

const { createHandlers } = createFactory();

const newClerkHndlr = createHandlers(
	zValidator("json", newUserSchema),
	async (c) => {
		const { _id: userId } = c.get("jwtPayload");
		const { name, mobile, email, password: rawPassword } = c.req.valid("json");

		const password = await Bun.password.hash(rawPassword, {
			algorithm: "bcrypt",
			cost: 4,
		});

		const newClerk = new User({
			name,
			mobile,
			email,
			password,
			role: "clerk",
			createdBy: userId,
		});

		try {
			const savedClerk = await newClerk.save();
			savedClerk.password = "";

			return c.json({
				data: savedClerk,
				message: "Clerk Created Successfully",
			});
		} catch (err) {
			if (err.code === 11000) {
				const duplicateField = Object.keys(err.keyPattern)[0];

				let message = "Duplicate field error.";
				if (duplicateField === "mobile") {
					message = "A user with this Mobile Number already exists.";
				} else if (duplicateField === "email") {
					message = "A user with this Email Address already exists.";
				}

				return badReq(c, message, message);
			}

			const message = "Something went wrong while creating the clerk.";
			return serverError(c, message, err);
		}
	},
);

const getClerkHndlr = createHandlers(paginator, async (c) => {
	const { _id } = c.get("jwtPayload");
	const adminId = c.req.param("clerkId");

	const { limit, skip } = c.get("paginator");

	const aggr = new Aggregate();

	aggr.match({
		role: "clerk",
		...(adminId && { _id: new ObjectId(adminId) }),
	});

	aggr.lookup({
		from: "users",
		localField: "createdBy",
		foreignField: "_id",
		as: "createdBy",
	});

	aggr.unwind({
		path: "$createdBy",
		preserveNullAndEmptyArrays: true,
	});

	aggr.addFields({
		"createdBy.isCreatedByMe": {
			$eq: ["$createdBy._id", new ObjectId(_id)],
		},
	});

	aggr.project({
		password: 0,
		"createdBy.password": 0,
	});

	const pipelineForCount = structuredClone(aggr.pipeline());
	pipelineForCount.push({ $count: "total" });
	pipelineForCount.push({
		$unwind: {
			path: "$total",
			preserveNullAndEmptyArrays: true,
		},
	});

	aggr.sort({
		createdAt: -1,
	});

	aggr.skip(skip).limit(limit);

	const pipeline = aggr.pipeline();

	const users = await User.aggregate(pipeline);
	const total = await User.aggregate(pipelineForCount);

	const data = adminId ? users[0] : users;

	return c.json({
		paginate: total[0],
		message: "All Clerk",
		data,
	});
});

const updateClerkHndlr = createHandlers(
	zValidator("json", updateUserSchema),
	async (c) => {
		const id = c.req.param("clerkId");
		const updatePayload = c.req.valid("json");

		if (updatePayload?.password) {
			updatePayload.password = await Bun.password.hash(updatePayload.password, {
				algorithm: "bcrypt",
				cost: 4,
			});
		}

		const foundClerk = await User.findByIdAndUpdate(id, updatePayload, {
			new: true,
		});

		if (!foundClerk) {
			return c.json({
				message: "Clerk doesn't exists",
			});
		}

		const savedClerk = await foundClerk.save();

		return c.json({
			id,
			data: savedClerk,
			message: "Clerk Updated Successfully",
		});
	},
);

const deleteClerkHndlr = createHandlers(async (c) => {
	const id = c.req.param("clerkId");
	if (!id) {
		return c.json({
			message: "Send clerkId",
		});
	}

	const foundClerk = await User.findByIdAndDelete(id);

	if (!foundClerk) {
		return c.json({
			message: "Clerk doesn't exists",
		});
	}

	await foundClerk.save();

	return c.json({
		data: null,
		message: "Clerk Deleted Successfully",
	});
});

export { newClerkHndlr, getClerkHndlr, updateClerkHndlr, deleteClerkHndlr };
