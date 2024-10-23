import { Hono } from "hono";
import { newHodHndlr, getHodHndlr, updateHodHndlr } from "../controller";
import { byRole, jwt } from "../middleware";

const hodRouter = new Hono();

hodRouter.use(jwt);

hodRouter.use(byRole("superadmin"));
hodRouter
  .get("/", ...getHodHndlr)
  .post(...newHodHndlr)
  .get("/:adminId", ...getHodHndlr)
  .patch(...updateHodHndlr);

export { hodRouter };
