import { Hono } from "hono";
import { stuAuthRouter, stuFeeRouter, stuProfileRouter } from "./student";
import { metaRouter } from "./metaRouter";
import { jwt, byRole } from "../middleware";

const studentRouter = new Hono();

studentRouter.route("/auth", stuAuthRouter);
studentRouter.route("/meta", metaRouter);

studentRouter.use(jwt);
studentRouter.use(byRole("student"));

studentRouter.route("/profile", stuProfileRouter).route("/fee", stuFeeRouter);

export { studentRouter };
