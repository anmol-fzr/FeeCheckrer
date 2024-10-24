import { createFactory } from "hono/factory";
import { stuLoginSchema } from "../schema";
import { zValidator } from "@hono/zod-validator";
import { User } from "../model";
import { jwtsHelper } from "../helper/jwt.helper";

const { createHandlers } = createFactory();

const loginHndlr = createHandlers(
  zValidator("json", stuLoginSchema),
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
        token,
      },
      message: "Logged in Successfully",
    });
  },
);

export { loginHndlr };
