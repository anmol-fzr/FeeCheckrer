import { Factory } from "hono/factory";
import { Aggregate } from "mongoose";
import { Fee } from "../model";

const { createHandlers } = new Factory();

const getFeeHndlr = createHandlers(async (c) => {
  const feeId = c.req.param("feeId");

  const aggr = new Aggregate();

  aggr.match({
    $expr: {
      $regexMatch: {
        input: { $toString: "$_id" },
        regex: feeId,
        options: "i",
      },
    },
  });

  aggr.lookup({
    localField: "studentId",
    foreignField: "_id",
    from: "students",
    as: "student",
  });

  aggr.unwind({
    path: "$student",
    preserveNullAndEmptyArrays: true,
  });
  const pipeline = aggr.pipeline();

  const fee = await Fee.aggregate(pipeline);

  return c.json({
    data: fee[0],
  });
});

const getFeesHndlr = createHandlers(async (c) => {
  const aggr = new Aggregate();

  aggr.lookup({
    localField: "studentId",
    foreignField: "_id",
    from: "students",
    as: "student",
  });

  aggr.unwind({
    path: "$student",
    preserveNullAndEmptyArrays: true,
  });

  aggr.lookup({
    localField: "student.details",
    foreignField: "_id",
    from: "studentdetails",
    as: "student.details",
  });

  aggr.unwind({
    path: "$student.details",
    preserveNullAndEmptyArrays: true,
  });

  const pipeline = aggr.pipeline();

  const fees = await Fee.aggregate(pipeline);

  c.res.headers.set("Cache-Control", `only-if-cached, public, max-age=420`);

  return c.json({
    data: fees,
  });
});

export { getFeeHndlr, getFeesHndlr };
