import { createFactory } from "hono/factory";
import { Dept } from "../model";

const { createHandlers } = createFactory();

const getMetaHndlr = createHandlers(async (c) => {
  const depts = await Dept.aggregate([
    {
      $addFields: {
        label: "$name",
        value: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
        name: 0,
        createdAt: 0,
        updatedAt: 0,
        createdBy: 0,
      },
    },
  ]);

  return c.json({
    data: { depts },
  });
});

export { getMetaHndlr };
