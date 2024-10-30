import { Hono } from "hono";
import { getFeeHndlr, getFeesHndlr, updateFeeHndlr } from "../controller";

const feesRouter = new Hono();

feesRouter
  .get("/", ...getFeesHndlr)
  .get("/:feeId", ...getFeeHndlr)
  .patch(...updateFeeHndlr);

export { feesRouter };
