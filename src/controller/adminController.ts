import { createFactory } from "hono/factory";
import { newUserSchema, updateUserSchema } from "../schema";
import { zValidator } from "@hono/zod-validator";
import { User } from "../model";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const { createHandlers } = createFactory();

const newAdminHndlr = createHandlers(
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

    const newAdmin = new User({
      name,
      mobile,
      email,
      password,
      deptId,
      role: "hod",
      createdBy: userId,
    });

    try {
    const savedAdmin = await newAdmin.save();
    savedAdmin.password = "";

    return c.json({
      data: savedAdmin,
      message: "Admin Created Successfully",
      success: true,
    });

    } catch (error) {

      console.log(error)
      return c.json(
        {
          message: "Admin with this email / phone number already exists",
          success: false,
          error,
        },
        400,
      );
    }
  },
);

const getAdminHndlr = createHandlers(async (c) => {
  const { _id } = c.get("jwtPayload");

  const users = await User.aggregate([
    {
      $match: {
        role: "hod",
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
        deptId: 0,
        "createdBy.password": 0,
      },
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ]);

  return c.json({
    data: users,
    message: "All Users",
  });
});

const updateAdminHndlr = createHandlers(
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

    const foundAdmin = await User.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!foundAdmin) {
      return c.json({
        message: "Admin doesn't exists",
      });
    }

    const savedAdmin = await foundAdmin.save();

    return c.json({
      id,
      data: savedAdmin,
      message: "Admin Updated Successfully",
    });
  },
);

export { newAdminHndlr, getAdminHndlr, updateAdminHndlr };
