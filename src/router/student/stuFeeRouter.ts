import { Hono } from "hono";
import { addFeeHndlr, getMyFeesHndlr } from "../../controller";

const stuFeeRouter = new Hono();

stuFeeRouter
	.get("/:feeId", ...getMyFeesHndlr)
	.get("/", ...getMyFeesHndlr)
	.post(...addFeeHndlr);

export { stuFeeRouter };
