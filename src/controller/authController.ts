import { createFactory } from "hono/factory";
import { loginSchema, updateAccountSchema } from "../schema";
import { zValidator } from "@hono/zod-validator";
import { User } from "../model";
import { jwtsHelper } from "../helper/jwt.helper";
import { passHelper } from "../helper";
import { jwt } from "../middleware";

const { createHandlers } = createFactory();

const loginHndlr = createHandlers(
  zValidator("json", loginSchema),
  async (c) => {
    const { email, password: rawPassword } = c.req.valid("json");

    const foundUser = await User.findOne({ email })
      .select("name role password")
      .lean();

    if (!foundUser) {
      return c.json(
        {
          message: "User doesn't Exists",
        },
        400,
      );
    }

    const passwordMatched = await Bun.password.verify(
      rawPassword,
      foundUser.password,
    );

    if (!passwordMatched) {
      return c.json(
        {
          message: "Incorrect Password",
        },
        400,
      );
    }

    const { _id, name, role } = foundUser;

    const token = await jwtsHelper.getLoginToken({
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
      return c.json(
        {
          message: "Unauthorized",
        },
        401,
      );
    }

    await foundUser.save();

    return c.json({ data: null, message: "Account Updated Successfully" });
  },
);

export { loginHndlr, updateAccountHndlr };
