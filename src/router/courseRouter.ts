import { Hono } from "hono";
import { addNewCourse, deleteCourse, getCourses } from "../controller";
import { jwt, byRole } from "../middleware";

const courseRouter = new Hono();

courseRouter.use(jwt);
courseRouter.use(byRole(["superadmin"]));

courseRouter
  .get("/", ...getCourses)
  .post(...addNewCourse)
  .delete("/:courseId", ...deleteCourse);

export { courseRouter };
