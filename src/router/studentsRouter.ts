import { Hono } from "hono";
import { getStudentHndlr, getStudentsHndlr } from "../controller";
import { jwt, byRole } from "../middleware";

const studentsRouter = new Hono();

studentsRouter.use(jwt);
studentsRouter.use(byRole(["superadmin", "hod", "clerk"]));

studentsRouter
  .get("/", ...getStudentsHndlr)
  .get("/:studentId", ...getStudentHndlr);

export { studentsRouter };
