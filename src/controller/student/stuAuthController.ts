import mongoose, { Aggregate, CastError } from "mongoose";
import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema, stuOnboardSchema } from "../../schema";
import { Student, StudentDetails } from "../../model";
import { passHelper, jwtsHelper } from "../../helper";
import { jwt } from "../../middleware";

const { createHandlers } = createFactory();

const ObjectId = mongoose.Types.ObjectId;

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
      _id: foundStudent._id.toString(),
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
    const { email, password: rawPass } = c.req.valid("json");

    const password = await passHelper.getHashedPassword(rawPass);

    const newStudent = new Student({
      email,
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
    } catch (err: CastError) {
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

const onboardStudentHndlr = createHandlers(
  jwt,
  zValidator("json", stuOnboardSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { _id: studentId } = c.get("jwtPayload");

    const stuDetails = new StudentDetails(body);

    try {
      const savedStuDetails = await stuDetails.save();

      const foundStudent = await Student.findByIdAndUpdate(
        studentId,
        {
          details: savedStuDetails._id,
        },
        { new: true },
      );

      if (!foundStudent) {
        return c.json(
          {
            data: null,
            message: "Unauthorized",
          },
          401,
        );
      }

      await foundStudent.save();

      return c.json({
        data: savedStuDetails,
        message: "Account Created Successfully",
      });
    } catch (err: CastError) {
      if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyPattern)[0];

        let message = "Duplicate field error.";
        if (duplicateField === "admissionNo") {
          message = "A user with this Admisson Number already exists.";
        } else if (duplicateField === "rollNo") {
          message = "A user with this Roll Number already exists.";
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

const stuProfileHndlr = createHandlers(jwt, async (c) => {
  const { _id: studentId } = c.get("jwtPayload");
  const aggr = new Aggregate();

  aggr.match({
    _id: new ObjectId(studentId),
  });

  aggr.lookup({
    from: "studentdetails",
    localField: "details",
    foreignField: "_id",
    as: "details",
  });

  aggr.unwind({
    path: "$details",
    preserveNullAndEmptyArrays: true,
  });

  aggr.project({
    password: 0,
    createdAt: 0,
    updatedAt: 0,
    details: {
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
    },
  });
  aggr.limit(1);

  const pipeline = aggr.pipeline();

  const stu = await Student.aggregate(pipeline);
  return c.json({ data: stu[0] });
});

export { loginStuHndlr, registerStuHndlr };
