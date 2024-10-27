import { Hono } from "hono";
import { getFeeHndlr,getFeesHndlr } from "../controller";

const feesRouter = new Hono();

feesRouter
  .get("/", ...getFeesHndlr)
  .get("/:feeId", ...getFeeHndlr);

export { feesRouter };
