import { Hono } from "hono";
import {
  loginStudentHndlr,
  onboardStudentHndlr,
  registerStudentHndlr,
  stuProfileHndlr,
} from "../controller";

const studentRouter = new Hono();

studentRouter
  .get("/", ...stuProfileHndlr)
  .post("/login", ...loginStudentHndlr)
  .post("/register", ...registerStudentHndlr)
  .post("/onboard", ...onboardStudentHndlr);

export { studentRouter };
