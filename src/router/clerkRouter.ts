import { Hono } from "hono";
import {
	newClerkHndlr,
	getClerkHndlr,
	updateClerkHndlr,
	deleteClerkHndlr,
} from "../controller";
import { byRole, jwt } from "../middleware";

const clerkRouter = new Hono();

clerkRouter.use(jwt);
clerkRouter.use(byRole(["superadmin", "hod"]));

clerkRouter
	.get("/", ...getClerkHndlr)
	.post(...newClerkHndlr)
	.get("/:clerkId", ...getClerkHndlr)
	.patch(...updateClerkHndlr)
	.delete(...deleteClerkHndlr);

export { clerkRouter };
