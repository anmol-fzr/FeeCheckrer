import { Hono } from "hono";
import { newAdminHndlr, getAdminHndlr, updateAdminHndlr } from "../controller";
import { byRole, jwt } from "../middleware";

const adminRouter = new Hono();

adminRouter.use(jwt);
adminRouter.use(byRole("superadmin"));

adminRouter
  .get("/", ...getAdminHndlr)
  .post(...newAdminHndlr)
  .patch("/:adminId", ...updateAdminHndlr);

export { adminRouter };
