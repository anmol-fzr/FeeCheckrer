import { createFactory } from "hono/factory";
import { newDeptSchema, updateDeptSchema } from "../schema";
import { zValidator } from "@hono/zod-validator";
import { Dept, User } from "../model";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const { createHandlers } = createFactory();

const newDeptHndlr = createHandlers(
  zValidator("json", newDeptSchema),
  async (c) => {
    const { _id: userId } = c.get("jwtPayload");
    const { name } = c.req.valid("json");

    const foundDept = await Dept.findOne({ name }).lean();

    if (foundDept) {
      return c.json(
        {
          message: "Department already exists",
        },
        400,
      );
    }

    const newDept = new Dept({
      name,
      createdBy: userId,
    });

    const savedDept = await newDept.save();

    return c.json({
      data: savedDept,
      message: "Department Created Successfully",
    });
  },
);

const getDeptHndlr = createHandlers(async (c) => {
  const { _id } = c.get("jwtPayload");

  const depts = await Dept.aggregate([
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
      $addFields: {
        "createdBy.isCreatedByMe": {
          $cond: {
            if: { $eq: ["$createdBy._id", new ObjectId(_id)] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $project: {
        password: 0,
        createdBy: {
          password: 0,
        },
      },
    },
  ]);

  return c.json({
    data: depts,
    message: "Departments List",
  });
});

const updateDeptHndlr = createHandlers(
  zValidator("json", updateDeptSchema),
  async (c) => {
    const id = c.req.param("deptId");
    const { name } = c.req.valid("json");

    const foundDept = await Dept.findByIdAndUpdate(id, { name }, { new: true });
    if (!foundDept) {
      return c.json(
        {
          message: "Department doesn't exists",
        },
        400,
      );
    }

    const savedDept = await foundDept.save();

    return c.json({
      data: savedDept,
      message: "Department Updated Successfully",
    });
  },
);

const deleteDeptHndlr = createHandlers(async (c) => {
  const id = c.req.param("deptId");

  const usersWithThisDept = await User.find({
    deptId: id,
  }).countDocuments();

  if (usersWithThisDept !== 0) {
    return c.json(
      {
        message: "Delete All the users before deleting this Department",
      },
      400,
    );
  }

  const foundDept = await Dept.findByIdAndDelete(id);
  if (!foundDept) {
    return c.json(
      {
        message: "Department already exists",
      },
      400,
    );
  }
  const deletedDept = await foundDept.save();

  return c.json({
    data: deletedDept,
    message: "Department Updated Successfully",
  });
});

export { newDeptHndlr, getDeptHndlr, updateDeptHndlr, deleteDeptHndlr };
