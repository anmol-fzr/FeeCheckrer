import { createFactory } from "hono/factory";
import { newUserSchema, updateUserSchema } from "../schema";
import { zValidator } from "@hono/zod-validator";
import { User } from "../model";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const { createHandlers } = createFactory();

const newClerkHndlr = createHandlers(
  zValidator("json", newUserSchema),
  async (c) => {
    const { _id: userId } = c.get("jwtPayload");
    const {
      name,
      mobile,
      email,
      password: rawPassword,
      deptId,
    } = c.req.valid("json");

    const password = await Bun.password.hash(rawPassword, {
      algorithm: "bcrypt",
      cost: 4,
    });

    const newClerk = new User({
      name,
      mobile,
      email,
      password,
      deptId,
      role: "clerk",
      createdBy: userId,
    });

    const savedClerk = await newClerk.save();
    savedClerk.password = "";

    return c.json({
      data: savedClerk,
      message: "Clerk Created Successfully",
    });
  },
);

const getClerkHndlr = createHandlers(async (c) => {
  const { _id, role } = c.get("jwtPayload");
  const pipeline = [
    {
      $match: {
        role: "clerk",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: {
        path: "$createdBy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "depts",
        localField: "deptId",
        foreignField: "_id",
        as: "dept",
      },
    },
    {
      $unwind: {
        path: "$dept",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        "createdBy.isCreatedByMe": {
          $eq: ["$createdBy._id", new ObjectId(_id)],
        },
      },
    },
    {
      $project: {
        password: 0,
        "createdBy.password": 0,
      },
    },
  ];

  const users = await User.aggregate(pipeline);

  return c.json({
    data: users,
    message: "All Clerk",
  });
});

const updateClerkHndlr = createHandlers(
  zValidator("json", updateUserSchema),
  async (c) => {
    const id = c.req.param("adminId");
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

export { newClerkHndlr, getClerkHndlr, updateClerkHndlr };
