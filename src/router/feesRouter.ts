import { Hono } from "hono";
import { getFeeHndlr, getFeesHndlr, updateFeeHndlr } from "../controller";
import { jwt, byRole } from "../middleware";

const feesRouter = new Hono();

feesRouter.use(jwt);
feesRouter.use(byRole(["superadmin", "hod", "clerk"]));

feesRouter
  .get("/", ...getFeesHndlr)
  .get("/:feeId", ...getFeeHndlr)
  .patch(...updateFeeHndlr);

export { feesRouter };
