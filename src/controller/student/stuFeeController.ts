import { zValidator } from "@hono/zod-validator";
import { Factory } from "hono/factory";
import { addFeeSchema } from "../../schema";
import { jwt } from "../../middleware";
import { Fee } from "../../model";
import mongoose, { Aggregate } from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const { createHandlers } = new Factory();

const addFeeHndlr = createHandlers(
  jwt,
  zValidator("json", addFeeSchema),
  async (c) => {
    const { studentId } = c.get("jwtPayload");
    const body = c.req.valid("json");

    const fee = new Fee({
      ...body,
      studentId,
    });
    const savedFee = await fee.save();

    return c.json({
      data: savedFee,
      message: "Fee Data Submitted Successfully",
    });
  },
);

const getMyFeesHndlr = createHandlers(jwt, async (c) => {
  const { studentId } = c.get("jwtPayload");

  const aggr = new Aggregate();

  aggr.match({
    studentId: new ObjectId(studentId),
  });

  aggr.project({
    studentId: 0,
  });

  aggr.sort({
    createdAt: -1,
  });

  const pipeline = aggr.pipeline();

  const myFees = await Fee.aggregate(pipeline);

  return c.json({
    data: myFees,
    message: "Fee Data Submitted Successfully",
  });
});

export { addFeeHndlr, getMyFeesHndlr };
