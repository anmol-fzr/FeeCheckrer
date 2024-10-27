import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../../schema";
import { Student } from "../../model";
import { passHelper, jwtsHelper } from "../../helper";

const { createHandlers } = createFactory();

const loginStuHndlr = createHandlers(
  zValidator("json", loginSchema),
  async (c) => {
    const { email, password: rawPass } = c.req.valid("json");

    const foundStudent = await Student.findOne({ email })
      .populate("details", "-_id -createdAt -updatedAt")
      .select("-createdAt -updatedAt")
      .lean();

    if (!foundStudent) {
      return c.json(
        {
          message: "User with this email doesn't exist.",
        },
        404,
      );
    }

    if (!foundStudent.isVerified) {
      return c.json(
        {
          message: "User isn't verified yet.",
        },
        404,
      );
    }

    const isPassOk = await passHelper.verifyPassword(
      rawPass,
      foundStudent.password,
    );

    if (!isPassOk) {
      return c.json(
        {
          message: "Incorrect Password.",
        },
        400,
      );
    }

    const token = await jwtsHelper.getStudentToken({
      studentId: foundStudent._id.toString(),
    });

    delete foundStudent.password;
    const isProfileComplete = foundStudent.details !== null;

    return c.json({
      data: {
        isProfileComplete,
        ...foundStudent,
        token,
      },
      message: "Logged in Successfully",
    });
  },
);

const registerStuHndlr = createHandlers(
  zValidator("json", registerSchema),
  async (c) => {
    const { email, password: rawPass,avatar } = c.req.valid("json");

    const password = await passHelper.getHashedPassword(rawPass);

    const newStudent = new Student({
      email,
      avatar,
      password,
      isVerified: false,
    });

    try {
      const savedStudent = await newStudent.save();
      const token = await jwtsHelper.getStudentToken({
        studentId: savedStudent._id.toString(),
      });

      savedStudent.password = "";
      return c.json({
        data: { token },
        message: "Registered Successfully",
      });
    } catch (err: any) {
      if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyPattern)[0];

        let message = "Duplicate field error.";
        if (duplicateField === "email") {
          message = "A user with this Email Address already exists.";
        }

        return c.json(
          {
            error: message,
            message,
          },
          400,
        );
      }

      return c.json(
        {
          error: "Something went wrong while creating the clerk.",
          message: "Something went wrong while creating the clerk.",
        },
        500,
      );
    }
  },
);

export { loginStuHndlr, registerStuHndlr };
