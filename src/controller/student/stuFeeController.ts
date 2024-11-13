import { zValidator } from "@hono/zod-validator";
import { Factory } from "hono/factory";
import mongoose, { Aggregate } from "mongoose";

import { addFeeSchema } from "@/schema";
import { jwt } from "@/middleware";
import { Fee } from "@/model";
import { getFeeReceiptUri, uploadFeeReceipt } from "@/helper";

const ObjectId = mongoose.Types.ObjectId;

const { createHandlers } = new Factory();

const addFeeHndlr = createHandlers(
  jwt,
  zValidator("form", addFeeSchema),
  async (c) => {
    const { studentId } = c.get("jwtPayload");
    const body = c.req.valid("form");

    const formData = await c.req.formData();

    const file = formData.get("pdf") as File;

    const fee = new Fee({
      ...body,
      studentId,
    });

    const savedFee = await fee.save();

    const feeId = savedFee._id.toString();

    await uploadFeeReceipt({
      studentId,
      feeId,
      file,
    });

    return c.json({
      data: savedFee,
      message: "Fee Data Submitted Successfully",
    });
  },
);

const getMyFeesHndlr = createHandlers(jwt, async (c) => {
  const feeId = c.req.param("feeId");
  const { studentId } = c.get("jwtPayload");

  const aggr = new Aggregate();

  aggr.match({
    studentId: new ObjectId(studentId),
  });

  if (feeId) {
    aggr.match({
      _id: new ObjectId(feeId),
    });
  }

  aggr.project({
    studentId: 0,
  });

  aggr.sort({
    createdAt: -1,
  });

  const pipeline = aggr.pipeline();

  const myFees = await Fee.aggregate(pipeline);

  if (feeId) {
    const pdfUri = await getFeeReceiptUri({ studentId, feeId });

    const data = {
      ...myFees[0],
      pdfUri,
    };

    return c.json({
      data,
      message: "My Fees Data",
    });
  }

  return c.json({
    data: myFees,
    message: "My Fees Data",
  });
});

export { addFeeHndlr, getMyFeesHndlr };
