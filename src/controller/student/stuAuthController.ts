import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { stuLoginSchema, registerSchema } from "../../schema";
import { Student } from "../../model";
import { jwtsHelper, unauth } from "../../helper";
import { publishOnMailQueue } from "../../helper/mail.helper";
import { envs, genOtp } from "../../utils";
import { redisClient } from "../../config/redis.config";
import { jwt } from "../../middleware";
import { capitalCase } from "change-case";

const { createHandlers } = createFactory();
const { getLoginToken, getFullToken } = jwtsHelper.student;

const loginStuHndlr = createHandlers(
	zValidator("json", stuLoginSchema),
	async (c) => {
		const { email, otp } = c.req.valid("json");

		if (!otp) {
			const newOtp = envs.isDev ? 123456 : genOtp();

			redisClient.setex(email, 600, newOtp);

			publishOnMailQueue({
				type: "login-otp",
				email,
				otp: newOtp,
			});

			return c.json({
				message: `An OTP been sent on your email ${email}`,
			});
		}

		const savedOtp = await redisClient.getex(email);

		if (otp !== Number(savedOtp)) {
			return c.json(
				{
					message: `Incorrect OTP`,
				},
				400,
			);
		}

		const foundUser = await Student.findOne({ email }).select("_id").lean();
		const isNewUser = foundUser === null;

		let loginToken = "";

		if (isNewUser) {
			loginToken = await getLoginToken({ email });
		} else {
			loginToken = await getFullToken({
				studentId: foundUser?._id.toString(),
			});
		}

		return c.json({
			data: {
				isNewUser,
				token: loginToken,
			},
			message: `Login Successfully`,
		});
	},
);

const registerStuHndlr = createHandlers(
	jwt,
	zValidator("json", registerSchema),
	async (c) => {
		const { email: jwtEmail } = c.get("jwtPayload");
		const details = c.req.valid("json");

		if (jwtEmail !== details.email) {
			return unauth(c);
		}

		const newStudent = new Student(details);

		try {
			const savedStudent = await newStudent.save();

			const token = await getFullToken({
				studentId: savedStudent._id.toString(),
			});

			return c.json({
				data: { token },
				message: "Registered Successfully",
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

			const error = "Something went wrong while Registering New User.";

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

export { loginStuHndlr, registerStuHndlr };
