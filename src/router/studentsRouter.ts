import { Hono } from "hono";
import { getStudentHndlr, getStudentsHndlr } from "../controller";

const studentsRouter = new Hono();

studentsRouter
  .get("/", ...getStudentsHndlr)
  .get("/:studentId", ...getStudentHndlr);

export { studentsRouter };
