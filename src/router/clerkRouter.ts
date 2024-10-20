import { Hono } from "hono";
import { newClerkHndlr, getClerkHndlr, updateClerkHndlr } from "../controller";
import { byRole, jwt } from "../middleware";

const clerkRouter = new Hono();

clerkRouter.use(jwt);
clerkRouter.use(byRole(["superadmin", "hod"]));

clerkRouter
  .get("/", ...getClerkHndlr)
  .post(...newClerkHndlr)
  .patch("/:clerkId", ...updateClerkHndlr);

export { clerkRouter };
