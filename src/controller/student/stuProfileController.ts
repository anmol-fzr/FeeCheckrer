import mongoose, { Aggregate } from "mongoose";
import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { stuNewProfileSchema, stuProfileUpdateSchema } from "../../schema";
import { Student, StudentDetails } from "../../model";
import { jwt } from "../../middleware";
import { unauth } from "../../helper";
import { capitalCase } from "change-case";

const { createHandlers } = createFactory();

const ObjectId = mongoose.Types.ObjectId;

const newProfileHndlr = createHandlers(
  jwt,
  zValidator("json", stuNewProfileSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { studentId } = c.get("jwtPayload");

    const newDetails = new StudentDetails(body);

    try {
      const stuDetails = await newDetails.save();

      const foundStudent = await Student.findByIdAndUpdate(
        studentId,
        {
          details: stuDetails._id,
        },
        { new: true },
      );

      if (!foundStudent) {
        return unauth(c);
      }

      await foundStudent.save();

      return c.json({
        data: stuDetails,
        message: "Account Created Successfully",
      });
    } catch (err) {
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

const getProfileHndlr = createHandlers(jwt, async (c) => {
  const { studentId } = c.get("jwtPayload");
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

const updateProfileHndlr = createHandlers(
  jwt,
  zValidator("json", stuProfileUpdateSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { studentId } = c.get("jwtPayload");

    console.log(c.get("jwtPayload"));
    const student = await Student.findById(studentId).lean();
    console.log(student, studentId);
    if (!student) {
      return unauth(c);
    }
    if (!student?.details) {
      return unauth(c);
    }
    const detailsId = student.details;

    const newDetails = await StudentDetails.findByIdAndUpdate(detailsId, body, {
      new: true,
    });

    if (!newDetails) {
      return unauth(c);
    }

    try {
      const stuDetails = await newDetails.save();

      return c.json({
        data: stuDetails,
        message: "Profile Updated Successfully",
      });
    } catch (err) {
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

export { newProfileHndlr, getProfileHndlr, updateProfileHndlr };
