import { createFactory } from "hono/factory";
import { loginSchema, updateAccountSchema } from "@/schema";
import { zValidator } from "@hono/zod-validator";
import { User } from "@/model";
import { badReq, notFound, passHelper, unauth, jwtsHelper } from "@/helper";
import { jwt } from "@/middleware";
import { envs } from "@/utils";

const { createHandlers } = createFactory();
const { getLoginToken } = jwtsHelper.user;

const loginHndlr = createHandlers(
	zValidator("json", loginSchema),
	async (c) => {
		const { email, password: rawPassword } = c.req.valid("json");

		const foundUser = await User.findOne({ email })
			.select("name role password")
			.lean();

		if (!foundUser) {
			return notFound(c, "User doesn't Exists");
		}

		const passwordMatched = await Bun.password.verify(
			rawPassword,
			foundUser.password,
		);

		if (!passwordMatched) {
			return badReq(c, "Incorrect Password");
		}

		const { _id, name, role } = foundUser;

		const token = await getLoginToken({
			_id: _id.toString(),
			name,
			role,
		});

		return c.json({
			data: {
				name,
				role,
				email,
				token,
			},
			message: "Logged in Successfully",
		});
	},
);

const updateAccountHndlr = createHandlers(
	jwt,
	zValidator("json", updateAccountSchema),
	async (c) => {
		const { _id: userId } = c.get("jwtPayload");
		const { password: rawPass } = c.req.valid("json");

		const password = await passHelper.getHashedPassword(rawPass);

		const foundUser = await User.findByIdAndUpdate(
			userId,
			{ password },
			{ new: true },
		);

		if (!foundUser) {
			return unauth(c);
		}

		await foundUser.save();

		return c.json({ data: null, message: "Account Updated Successfully" });
	},
);

const createDefaultAdminHndlr = createHandlers(async (c) => {
	const { EMAIL, PASSWORD, NAME, MOBILE } = envs.SA;

	const foundSA = await User.findOne({ role: "superadmin" });

	if (foundSA) {
		return c.json(
			{
				message: "Please Check Your Credentials",
				error: "A Superadmin already Exists Exiting ...",
			},
			400,
		);
	}

	const password = await passHelper.getHashedPassword(PASSWORD);

	const sa = new User({
		name: NAME,
		role: "superadmin",
		email: EMAIL,
		password,
		mobile: Number(MOBILE),
	});

	try {
		const savedSA = await sa.save();
		console.log("Superadmin Created SuccessFully with creds ", savedSA);
		return c.json({
			message: "Superadmin Created SuccessFully with creds ",
		});
	} catch (error) {
		console.log("Unable to Create a new superadmin");
		console.log(error);
		return c.json({
			message: "Unable to Create a new superadmin",
			error,
		});
	}
});

export { loginHndlr, updateAccountHndlr, createDefaultAdminHndlr };
