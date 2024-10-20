import { Hono } from "hono";
import {
  getDeptHndlr,
  newDeptHndlr,
  updateDeptHndlr,
  deleteDeptHndlr,
} from "../controller";
import { jwt, byRole } from "../middleware";

const deptRouter = new Hono();

deptRouter.use(jwt);
deptRouter.use(byRole(["superadmin", "hod"]));

deptRouter
  .get("/", ...getDeptHndlr)
  .post(...newDeptHndlr)
  .patch("/:deptId", ...updateDeptHndlr)
  .delete(...deleteDeptHndlr);

export { deptRouter };
