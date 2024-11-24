import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { stuProfileUpdateSchema } from "../../schema";
import { Student } from "../../model";
import { jwt } from "../../middleware";
import { unauth } from "../../helper";
import { capitalCase } from "change-case";

const { createHandlers } = createFactory();

const getProfileHndlr = createHandlers(jwt, async (c) => {
	const { studentId } = c.get("jwtPayload");

	const student = await Student.findById(studentId)
		.select("-createdAt -updatedAt -_id")
		.lean();

	return c.json({ data: student });
});

const updateProfileHndlr = createHandlers(
	jwt,
	zValidator("json", stuProfileUpdateSchema),
	async (c) => {
		const body = c.req.valid("json");
		const { studentId } = c.get("jwtPayload");

		const student = await Student.findByIdAndUpdate(studentId, body, {
			new: true,
		});

		if (!student) {
			return unauth(c);
		}

		try {
			const updatedStudent = await student.save();

			return c.json({
				data: updatedStudent,
				message: "Profile Updated Successfully",
			});
		} catch (err: any) {
			if (err.code === 11000) {
				const path = Object.keys(err.keyPattern)[0];

				const message = `A user with this ${capitalCase(path)} already exists.`;

				return c.json(
					{
						error: message,
						message,
					},
					400,
				);
			}

			const error = "Something went wrong while Updaing Your Profile.";

			return c.json(
				{
					error,
					message: error,
				},
				500,
			);
		}
	},
);

export { getProfileHndlr, updateProfileHndlr };
