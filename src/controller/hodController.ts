import { createFactory } from "hono/factory";
import { newUserSchema, updateUserSchema } from "../schema";
import { zValidator } from "@hono/zod-validator";
import { User } from "../model";
import mongoose, { Aggregate } from "mongoose";
import { paginator } from "../middleware";
import { getAggrForPagintn } from "../utils";

const ObjectId = mongoose.Types.ObjectId;

const { createHandlers } = createFactory();

const newHodHndlr = createHandlers(
  zValidator("json", newUserSchema),
  async (c) => {
    const { _id: userId } = c.get("jwtPayload");
    const { name, mobile, email, password: rawPassword } = c.req.valid("json");

    const password = await Bun.password.hash(rawPassword, {
      algorithm: "bcrypt",
      cost: 4,
    });

    const newHod = new User({
      name,
      mobile,
      email,
      password,
      role: "hod",
      createdBy: userId,
    });

    try {
      const savedHod = await newHod.save();
      savedHod.password = "";

      return c.json({
        data: savedHod,
        message: "Hod Created Successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return c.json(
        {
          message: "Hod with this email / phone number already exists",
          success: false,
          error,
        },
        400,
      );
    }
  },
);

const getHodHndlr = createHandlers(paginator, async (c) => {
  const { _id } = c.get("jwtPayload");
  const adminId = c.req.param("adminId");

  const aggr = new Aggregate();

  aggr.match({
    role: "hod",
    ...(adminId && { _id: new ObjectId(adminId) }),
  });

  aggr.lookup({
    from: "users",
    localField: "createdBy",
    foreignField: "_id",
    as: "createdBy",
  });

  aggr.unwind({
    path: "$createdBy",
    preserveNullAndEmptyArrays: true,
  });

  aggr.addFields({
    "createdBy.isCreatedByMe": {
      $eq: ["$createdBy._id", new ObjectId(_id)],
    },
  });

  let pipelineForCount = getAggrForPagintn(aggr);
  pipelineForCount.push({ $count: "total" });
  pipelineForCount.push({
    $unwind: {
      path: "$total",
      preserveNullAndEmptyArrays: true,
    },
  });

  aggr.project({
    password: 0,
    "createdBy.password": 0,
  });

  aggr.sort({
    createdAt: -1,
  });

  const pipeline = aggr.pipeline();

  const users = await User.aggregate(pipeline);
  const total = await User.aggregate(pipelineForCount);

  return c.json({
    paginate: total[0],
    data: adminId ? users[0] : users,
    message: "All Users",
  });
});

const updateHodHndlr = createHandlers(
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

    const foundHod = await User.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!foundHod) {
      return c.json({
        message: "Hod doesn't exists",
      });
    }

    const savedHod = await foundHod.save();

    return c.json({
      id,
      data: savedHod,
      message: "Hod Updated Successfully",
    });
  },
);

export { newHodHndlr, getHodHndlr, updateHodHndlr };
